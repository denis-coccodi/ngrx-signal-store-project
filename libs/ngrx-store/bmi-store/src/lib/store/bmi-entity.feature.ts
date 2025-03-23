import { computed, Signal } from '@angular/core';
import { signalStoreFeature, type, withComputed } from '@ngrx/signals';
import { entityConfig } from '@ngrx/signals/entities';
import { Bmi } from '@types-lib';
import { filterListByServiceCodes, sortByCreatedDate } from './bmi-store.utils';

export const bmiItemConfig = entityConfig({
  entity: type<Bmi.EditableUserBMI>(),
  collection: Bmi.BmiEntitiesEnum.COLLECTION_NAME,
  selectId: bmiItem => bmiItem.order.mail_order_fill_request_id,
});

export function withBmiItemEntity() {
  return signalStoreFeature(
    { state: type<Bmi.BmiEntityState & { bmiItemEntities?: Bmi.EditableUserBMI[] }>() },
    withComputed(({ bmiListOptions: { filterBy, sort, pagination }, bmiItemEntities, bmiItemEntityMap }) => ({
      sortedAndFilteredBmiList: computed(() =>
        filterListByServiceCodes((bmiItemEntities as Signal<Bmi.EditableUserBMI[]>)(), filterBy()).sort(sortByCreatedDate(sort())),
      ),
      itemBeingEdited: computed(() => (bmiItemEntities as Signal<Bmi.EditableUserBMI[]>)().find(bmiItem => bmiItem.editMode)),
      fullListLength: computed(() => (bmiItemEntities as Signal<Bmi.EditableUserBMI[]>)().length),
    })),
  );
}
