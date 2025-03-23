export const Notifications = {
  payment: {
    fieldsMissing: 'Some fields are missing',
  },
  generic: {
    failure: 'Something went wrong, please try again.',
  },
  auth: {
    loginFailed: 'Could not login. Verify you are using the correct credentials.',

    // forbidden: 'You must be a doctor or administrator to use this platform.',
    forbidden: 'You must have specific roles to use this platform.',
    loginLockout:
      "For security reasons we've locked your account. To unlock " +
      'your account please reset your password <a href="/forgot-password">here</a>.',

    sendResetEmailSuccess: 'If we have this email on record, we have sent an email containing a reset code.',
    sendResetEmailFailed: 'We are having trouble sending the email. Please try again.',
    resetPasswordSuccess: 'We have successfully reset your password',
    resetPasswordFailed: "We're having trouble resetting your password. Please try again.",
  },
  users: {
    createSuccess: 'New user has been successfully created.',
    createFailed: 'Something went wrong, please try again.',
    emailInUse: 'That email is already in use',
    invalidEmail: 'That email is invalid.',
    updateSuccess: 'User has been successfully updated.',
    updateFailed: 'User could not be updated, please try again later.',
    invalidForm: 'Please make sure all required fields are filled in.',
    noteMissing: 'Please provide a note before adding a role.',
  },
  pharmacy: {
    updateManagerSuccess: 'Manager details have successfully updated',
    updateManagerFailed: 'Manager details did not update, please try again',
  },
  status: {
    device:
      'This will disable the services for the platforms listed above. Users currently using the app will not be affected',
    api: 'If you turn this off, the service will become immediately unavailable to all app users, regardless of where they are in the app - a user in the app will be disconnected and sent to the service unavailable screen the next time they do something.',
  },
  messages: {
    markReadSuccess: 'Messages marked as read.',
    markReadFailed: 'Something went wrong, please try again.',
  },
  patient: {
    notes: {
      success: 'Your note was successfully saved.',
      error: 'Something went wrong saving your note.',
    },
    sms: {
      optOutSmsMessages: 'Patient has chosen to opt out of text messages',
    },
  },
  orders: {
    locked: 'This visit is locked. Only the acting doctor may proceed.',
    slv: {
      notInQueue: 'Cannot find patient in queue.',
      hangupFailed: 'Could not hang up this call.',
    },
    pharmacy: {
      failed: 'Something went wrong, please try again.',
      updated: 'Pharmacy updated.',
    },
    treatments: {
      submitted: 'Treatments successfully submitted.',
    },
    photos: {
      approved: 'Photos marked as approved.',
      rejected: 'Photos marked as rejected.',
      failed: 'Something went wrong, please try again.',
      selfieUploadedSeparately:
        'A visit with a selfie photo needs reviewing first, please look into another pending visit',
      loadFailed: 'Could not download the photos',
    },
    deny: 'Visit has been denied',
    unlockFailed: 'The visit could not be unlocked',
    finalize: 'Visit has been finalized and notifications have been sent.',
    dates: {
      rangeInvalid: 'The "from" date must come before the "to" date',
    },
    notes: {
      success: 'Your note was successfully saved.',
      error: 'Something went wrong saving your note.',
    },
  },
  promos: {
    discountNotANumber: 'Discount value must be a number.',
    noEmailDomains: 'Please enter at least one email domain.',
    minimumServiceRequired: 'At least one service must be selected, or Select All for a global promo',
    noDates: 'Please provide a start and end date.',
    noStartDate: 'Please provide a start date.',
    noEndDate: 'Please provide an end date.',
    dollarDiscountTooHigh: 'The dollar value can not be greater than 25.',
    percentDiscountTooHigh: 'The percent value can not be greater than 100.',
    discountValueTooLow: 'The discount value must be greater than 0.',
    updateSuccess: 'Campaign has been updated.',
    decreaseUsesAfterStart: 'You can not decrease the number of max uses once a campaign begins.',
    decreaseUsesSingleUse: 'You can not decrease the number of codes in a single use campaign.',
  },
};
