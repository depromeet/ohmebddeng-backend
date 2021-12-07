import { TASTE_TAG } from 'src/common/enums/taste-tag';

export const produceTasteTagString = (tasteTagId: string): TASTE_TAG => {
  switch (tasteTagId) {
    case '1':
      return TASTE_TAG.MAECONDALKOM;
    case '2':
      return TASTE_TAG.DRINK_LIKE;
    case '3':
      return TASTE_TAG.LAST_SPICY;
    case '4':
      return TASTE_TAG.EOLEOL;
    case '5':
      return TASTE_TAG.MARA;
    case '6':
      return TASTE_TAG.CAPSAICIN;
    case '7':
      return TASTE_TAG.FIVE_STAR;
    case '8':
      return TASTE_TAG.SOMETIME;
    case '9':
      return TASTE_TAG.SWEAT;
    case '10':
      return TASTE_TAG.TEARS;
    case '11':
      return TASTE_TAG.EOJIL;
    case '12':
      return TASTE_TAG.MILK_ESSENTIAL;
    case '13':
      return TASTE_TAG.STRESS_RELIEF;
    case '14':
      return TASTE_TAG.JEONSULI_HOT;
    default:
      return TASTE_TAG.MAECONDALKOM;
  }
};

export const produceTasteTagId = (tasteTagId: TASTE_TAG): string => {
  switch (tasteTagId) {
    case TASTE_TAG.MAECONDALKOM:
      return '1';
    case TASTE_TAG.DRINK_LIKE:
      return '2';
    case TASTE_TAG.LAST_SPICY:
      return '3';
    case TASTE_TAG.EOLEOL:
      return '4';
    case TASTE_TAG.MARA:
      return '5';
    case TASTE_TAG.CAPSAICIN:
      return '6';
    case TASTE_TAG.FIVE_STAR:
      return '7';
    case TASTE_TAG.SOMETIME:
      return '8';
    case TASTE_TAG.SWEAT:
      return '9';
    case TASTE_TAG.TEARS:
      return '10';
    case TASTE_TAG.EOJIL:
      return '11';
    case TASTE_TAG.MILK_ESSENTIAL:
      return '12';
    case TASTE_TAG.STRESS_RELIEF:
      return '13';
    case TASTE_TAG.JEONSULI_HOT:
      return '14';
    default:
      return '1';
  }
};
