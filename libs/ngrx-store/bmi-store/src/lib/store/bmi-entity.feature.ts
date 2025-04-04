import { computed } from '@angular/core';
import { signalStoreFeature, type, withComputed } from '@ngrx/signals';
import { entityConfig } from '@ngrx/signals/entities';
import { Bmi } from '@types-lib';
import { filterListByServiceCodes, sortByCreatedDate } from './bmi-store.utils';

export const bmiItemConfig = entityConfig({
  entity: type<Bmi.EditableUserBMI>(),
  collection: Bmi.BmiEntitiesEnum.COLLECTION_NAME,
  selectId: (bmiItem) => bmiItem.order.mail_order_fill_request_id,
});

export function withBmiItemEntity() {
  return signalStoreFeature(
    { state: type<Bmi.BmiEntityState>() },
    withComputed(
      ({
        bmiListOptions: { filterBy, sort, pagination },
        bmiItemEntityMap,
      }) => {
        const bmiItemEntities = computed(() =>
          Object.values(bmiItemEntityMap())
        );
        return {
          sortedAndFilteredBmiList: computed(() =>
            filterListByServiceCodes(bmiItemEntities(), filterBy()).sort(
              sortByCreatedDate(sort())
            )
          ),
          itemBeingEdited: computed(() =>
            bmiItemEntities().find((bmiItem) => bmiItem.editMode)
          ),
          fullListLength: computed(() => bmiItemEntities().length),
        };
      }
    )
  );
}
