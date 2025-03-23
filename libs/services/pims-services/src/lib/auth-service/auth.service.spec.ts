import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Users } from '@types-lib';
import { AuthService } from './auth.service';

const mockUser: Users.User = {
  address: {
    id: 0,
    user_id: 0,
    road: '',
    city: '',
    state: '',
    zip: '',
  },
  dob: '',
  email: '',
  gender: '',
  id: 0,
  initials: '',
  password: '',
  phones: [],
  roles: {},
  security: { answer: '', question: '' },
  title: '',
  firstname: 'Joe',
  lastname: 'Bloggs',
};

const mockCredentials: Users.AuthPostRequest = {
  username: 'test',
  password: 'test',
};
const mockToken: Users.AuthPostResponse = { token: 'abc123' };

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Mock localStorage methods with Jest functions
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    jest.spyOn(localStorage, 'getItem');
    jest.spyOn(localStorage, 'setItem');
    jest.spyOn(localStorage, 'removeItem');
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should store token in localStorage and reset userSubject$ on successful login', () => {
      service.login(mockCredentials).subscribe((response) => {
        expect(response).toEqual(mockToken);
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'abc123');
        expect(service.profile).toBeNull(); // Ensure userSubject$ was reset
      });

      const req = httpMock.expectOne('/v2.0/users/me/authenticate');
      expect(req.request.method).toBe('POST');
      req.flush(mockToken);
    });

    it('should remove token from localStorage and return null on failed login', () => {
      service.login(mockCredentials).subscribe((response) => {
        expect(response).toBeNull();
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      });

      const req = httpMock.expectOne('/v2.0/users/me/authenticate');
      expect(req.request.method).toBe('POST');
      req.error(new ErrorEvent('Network error'));
    });
  });
  describe('isLoggedIn', () => {
    it('should return false if no token is present in localStorage', (done) => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      service.isLoggedIn().subscribe((isLoggedIn) => {
        expect(isLoggedIn).toBe(false);
        expect(service.profile).toBeNull(); // userSubject$ should be null
        done();
      });
    });

    it('should return true if user is already loaded in userSubject$', (done) => {
      service['userSubject$'].next(mockUser); // Set the user profile in the BehaviorSubject

      (localStorage.getItem as jest.Mock).mockReturnValue(mockToken.token);

      service.isLoggedIn().subscribe((isLoggedIn) => {
        expect(isLoggedIn).toBe(true);
        done();
      });
    });

    it('should fetch profile and return true if token exists but user is not loaded', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(mockToken.token);

      service.isLoggedIn().subscribe((isLoggedIn) => {
        expect(isLoggedIn).toBe(true);
        expect(service.profile).toEqual(mockUser);
      });

      const req = httpMock.expectOne('/v2.0/users/me/details');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should remove token from localStorage and return false if profile fetch fails', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(mockToken.token);

      service.isLoggedIn().subscribe((isLoggedIn) => {
        expect(isLoggedIn).toBe(false);
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
        expect(service.profile).toBeNull();
      });

      const req = httpMock.expectOne('/v2.0/users/me/details');
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('Network error'));
    });
  });
});
