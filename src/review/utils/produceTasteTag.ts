import { TASTE_TAG } from 'src/common/enums/taste-tag';

export const produceTasteTagString = (tasteTagId: string): TASTE_TAG => {
  switch (tasteTagId) {
    case '1':
      return TASTE_TAG.EOLEOL;
    case '2':
      return TASTE_TAG.KALKAL;
    case '3':
      return TASTE_TAG.MAECOMDALCOM;
    case '4':
      return TASTE_TAG.ALSSA;
    case '5':
      return TASTE_TAG.EOLKEUN;
    default:
      return TASTE_TAG.GAEUN;
  }
};
