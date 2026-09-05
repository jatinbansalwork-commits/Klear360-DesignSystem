import { opacity } from './opacity';

export type ColorChromaticScale = Readonly<{
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
  a50: string;
  a100: string;
  a150: string;
  a200: string;
  a400: string;
  a500?: string;
  a600?: string;
  a700?: string;
}>;

export type ColorChromaticScaleExtended = Readonly<{
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
  a50: string;
  a100: string;
  a150: string;
  a200: string;
  a400: string;
  a500: string;
  a600: string;
  a700: string;
}>;

export type ColorNeutralGrayScale = Readonly<{
  0: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
  1100: string;
  1200: string;
  1300: string;
  a25: string;
  a50: string;
  a75: string;
  a100: string;
  a200: string;
  a400: string;
  a500?: string;
  a600?: string;
  a700?: string;
}>;

export type ColorNeutralGrayScaleExtended = Readonly<{
  0: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
  1100: string;
  1200: string;
  1300: string;
  a25: string;
  a50: string;
  a75: string;
  a100: string;
  a200: string;
  a400: string;
  a500: string;
  a600: string;
  a700: string;
}>;

export type ColorBlueGrayLightScale = Readonly<{
  0: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
  1100: string;
  1200: string;
  1300: string;
  a0: string;
  a1: string;
  a25: string;
  a48: string;
  a50: string;
  a75: string;
  a100: string;
  a200: string;
  a230: string;
  a330: string;
  a400: string;
  a406: string;
  a500: string;
  a600: string;
  a700: string;
  a906: string;
  a900: string;
  a909: string;
  a912: string;
  a917: string;
  a918: string;
  a932: string;
  a964: string;
  a1072: string;
  a1106: string;
  a1264: string;
  a1288: string;
}>;

export type ColorBlueGrayDarkScale = Readonly<{
  0: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
  1100: string;
  1200: string;
  1300: string;
  a0: string;
  a1: string;
  a25: string;
  a48: string;
  a50: string;
  a75: string;
  a100: string;
  a200: string;
  a300: string;
  a400: string;
  a500: string;
  a506: string;
  a509: string;
  a512: string;
  a518: string;
  a523: string;
  a532: string;
  a630: string;
  a830: string;
  a564: string;
  a572: string;
  a888: string;
  a1188: string;
  a1194: string;
  a1312: string;
  a1388: string;
}>;

export type ColorNeutralStaticScale = Readonly<{
  1: string;
  5: string;
  10: string;
  25: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  450: string;
  500: string;
}>;

export type Color = Readonly<{
  chromatic: {
    azure: ColorChromaticScale;
    emerald: ColorChromaticScaleExtended;
    crimson: ColorChromaticScaleExtended;
    cider: ColorChromaticScaleExtended;
    sapphire: ColorChromaticScaleExtended;
    sea: ColorChromaticScale;
    cloud: ColorChromaticScale;
    forest: ColorChromaticScale;
    orchid: ColorChromaticScale;
    magenta: ColorChromaticScale;
    topaz: ColorChromaticScale;
  };
  neutral: {
    blueGrayLight: ColorBlueGrayLightScale;
    blueGrayDark: ColorBlueGrayDarkScale;
    ashGrayLight: ColorNeutralGrayScale;
    ashGrayDark: ColorNeutralGrayScale;
    white: ColorNeutralStaticScale;
    black: ColorNeutralStaticScale;
  };
}>;

export const colors: Color = {
  chromatic: {
    azure: {
      50: `hsla(207, 23%, 92%, ${opacity[1300]})`,
      100: `hsla(196, 21%, 74%, ${opacity[1300]})`,
      200: `hsla(200, 23%, 63%, ${opacity[1300]})`,
      300: `hsla(198, 27%, 45%, ${opacity[1300]})`,
      400: `hsla(199, 39%, 35%, ${opacity[1300]})`,
      500: `hsla(198, 100%, 18%, ${opacity[1300]})`,
      600: `hsla(200, 98%, 17%, ${opacity[1300]})`,
      700: `hsla(200, 97%, 14%, ${opacity[1300]})`,
      800: `hsla(200, 93%, 11%, ${opacity[1300]})`,
      900: `hsla(197, 100%, 7%, ${opacity[1300]})`,
      1000: `hsla(197, 100%, 4%, ${opacity[1300]})`,
      a50: `hsla(198, 100%, 18%, ${opacity[100]})`,
      a100: `hsla(198, 100%, 18%, ${opacity[300]})`,
      a150: `hsla(198, 100%, 18%, ${opacity[400]})`,
      a200: `hsla(198, 100%, 18%, ${opacity[500]})`,
      a400: `hsla(198, 100%, 18%, ${opacity[800]})`,
    },
    emerald: {
      50: `hsla(147, 60%, 97%, ${opacity[1300]})`,
      100: `hsla(139, 52%, 87%, ${opacity[1300]})`,
      200: `hsla(142, 58%, 77%, ${opacity[1300]})`,
      300: `hsla(142, 58%, 66%, ${opacity[1300]})`,
      400: `hsla(142, 58%, 56%, ${opacity[1300]})`,
      500: `hsla(142, 69%, 46%, ${opacity[1300]})`,
      600: `hsla(143, 73%, 40%, ${opacity[1300]})`,
      700: `hsla(143, 72%, 31%, ${opacity[1300]})`,
      800: `hsla(142, 71%, 25%, ${opacity[1300]})`,
      900: `hsla(144, 72%, 18%, ${opacity[1300]})`,
      1000: `hsla(144, 72%, 11%, ${opacity[1300]})`,
      a50: `hsla(143, 73%, 40%, ${opacity[100]})`,
      a100: `hsla(143, 73%, 40%, ${opacity[300]})`,
      a150: `hsla(143, 73%, 40%, ${opacity[400]})`,
      a200: `hsla(143, 73%, 40%, ${opacity[500]})`,
      a400: `hsla(143, 73%, 40%, ${opacity[800]})`,
      a500: `hsla(143, 73%, 40%, ${opacity[900]})`,
      a600: `hsla(143, 73%, 40%, ${opacity[1000]})`,
      a700: `hsla(143, 73%, 40%, ${opacity[1100]})`,
    },
    crimson: {
      50: `hsla(10, 100%, 98%, ${opacity[1300]})`,
      100: `hsla(2, 100%, 90%, ${opacity[1300]})`,
      200: `hsla(4, 100%, 83%, ${opacity[1300]})`,
      300: `hsla(4, 100%, 75%, ${opacity[1300]})`,
      400: `hsla(3, 100%, 68%, ${opacity[1300]})`,
      500: `hsla(3, 100%, 60%, ${opacity[1300]})`,
      600: `hsla(3, 69%, 51%, ${opacity[1300]})`,
      700: `hsla(3, 67%, 42%, ${opacity[1300]})`,
      800: `hsla(3, 66%, 33%, ${opacity[1300]})`,
      900: `hsla(3, 69%, 24%, ${opacity[1300]})`,
      1000: `hsla(3, 69%, 15%, ${opacity[1300]})`,
      a50: `hsla(3, 69%, 51%, ${opacity[100]})`,
      a100: `hsla(3, 69%, 51%, ${opacity[300]})`,
      a150: `hsla(3, 69%, 51%, ${opacity[400]})`,
      a200: `hsla(3, 69%, 51%, ${opacity[500]})`,
      a400: `hsla(3, 69%, 51%, ${opacity[800]})`,
      a500: `hsla(3, 69%, 51%, ${opacity[900]})`,
      a600: `hsla(3, 69%, 51%, ${opacity[1000]})`,
      a700: `hsla(3, 69%, 51%, ${opacity[1100]})`,
    },
    cider: {
      50: `hsla(39, 93%, 95%, ${opacity[1300]})`,
      100: `hsla(36, 93%, 84%, ${opacity[1300]})`,
      200: `hsla(35, 92%, 76%, ${opacity[1300]})`,
      300: `hsla(35, 93%, 65%, ${opacity[1300]})`,
      400: `hsla(35, 92%, 59%, ${opacity[1300]})`,
      500: `hsla(35, 100%, 48%, ${opacity[1300]})`,
      600: `hsla(35, 99%, 44%, ${opacity[1300]})`,
      700: `hsla(34, 94%, 35%, ${opacity[1300]})`,
      800: `hsla(35, 99%, 27%, ${opacity[1300]})`,
      900: `hsla(35, 100%, 20%, ${opacity[1300]})`,
      1000: `hsla(35, 100%, 13%, ${opacity[1300]})`,
      a50: `hsla(35, 99%, 44%, ${opacity[100]})`,
      a100: `hsla(35, 99%, 44%, ${opacity[300]})`,
      a150: `hsla(35, 99%, 44%, ${opacity[400]})`,
      a200: `hsla(35, 99%, 44%, ${opacity[500]})`,
      a400: `hsla(35, 99%, 44%, ${opacity[800]})`,
      a500: `hsla(35, 99%, 44%, ${opacity[900]})`,
      a600: `hsla(35, 99%, 44%, ${opacity[1000]})`,
      a700: `hsla(35, 99%, 44%, ${opacity[1100]})`,
    },
    sapphire: {
      50: `hsla(190, 32%, 93%, ${opacity[1300]})`,
      100: `hsla(193, 31%, 77%, ${opacity[1300]})`,
      200: `hsla(198, 33%, 66%, ${opacity[1300]})`,
      300: `hsla(193, 32%, 49%, ${opacity[1300]})`,
      400: `hsla(194, 49%, 39%, ${opacity[1300]})`,
      500: `hsla(195, 100%, 24%, ${opacity[1300]})`,
      600: `hsla(195, 100%, 22%, ${opacity[1300]})`,
      700: `hsla(196, 98%, 18%, ${opacity[1300]})`,
      800: `hsla(195, 100%, 13%, ${opacity[1300]})`,
      900: `hsla(194, 100%, 10%, ${opacity[1300]})`,
      1000: `hsla(194, 100%, 7%, ${opacity[1300]})`,
      a50: `hsla(195, 100%, 22%, ${opacity[100]})`,
      a100: `hsla(195, 100%, 22%, ${opacity[300]})`,
      a150: `hsla(195, 100%, 22%, ${opacity[400]})`,
      a200: `hsla(195, 100%, 22%, ${opacity[500]})`,
      a400: `hsla(195, 100%, 22%, ${opacity[800]})`,
      a500: `hsla(195, 100%, 22%, ${opacity[900]})`,
      a600: `hsla(195, 100%, 22%, ${opacity[1000]})`,
      a700: `hsla(195, 100%, 22%, ${opacity[1100]})`,
    },
    sea: {
      50: `hsla(191, 74%, 95%, ${opacity[1300]})`,
      100: `hsla(189, 70%, 91%, ${opacity[1300]})`,
      200: `hsla(189, 72%, 82%, ${opacity[1300]})`,
      300: `hsla(189, 71%, 73%, ${opacity[1300]})`,
      400: `hsla(189, 71%, 59%, ${opacity[1300]})`,
      500: `hsla(189, 94%, 43%, ${opacity[1300]})`,
      600: `hsla(189, 94%, 35%, ${opacity[1300]})`,
      700: `hsla(189, 94%, 28%, ${opacity[1300]})`,
      800: `hsla(189, 94%, 21%, ${opacity[1300]})`,
      900: `hsla(189, 95%, 15%, ${opacity[1300]})`,
      1000: `hsla(189, 96%, 11%, ${opacity[1300]})`,
      a50: `hsla(189, 94%, 35%, ${opacity[100]})`,
      a100: `hsla(189, 94%, 35%, ${opacity[300]})`,
      a150: `hsla(189, 94%, 35%, ${opacity[400]})`,
      a200: `hsla(189, 94%, 35%, ${opacity[500]})`,
      a400: `hsla(189, 94%, 35%, ${opacity[800]})`,
    },
    cloud: {
      50: `hsla(216, 88%, 97%, ${opacity[1300]})`,
      100: `hsla(218, 94%, 94%, ${opacity[1300]})`,
      200: `hsla(217, 91%, 87%, ${opacity[1300]})`,
      300: `hsla(217, 92%, 81%, ${opacity[1300]})`,
      400: `hsla(217, 92%, 71%, ${opacity[1300]})`,
      500: `hsla(217, 91%, 60%, ${opacity[1300]})`,
      600: `hsla(217, 61%, 49%, ${opacity[1300]})`,
      700: `hsla(217, 62%, 39%, ${opacity[1300]})`,
      800: `hsla(217, 62%, 30%, ${opacity[1300]})`,
      900: `hsla(218, 61%, 21%, ${opacity[1300]})`,
      1000: `hsla(217, 63%, 15%, ${opacity[1300]})`,
      a50: `hsla(217, 61%, 49%, ${opacity[100]})`,
      a100: `hsla(217, 61%, 49%, ${opacity[300]})`,
      a150: `hsla(217, 61%, 49%, ${opacity[400]})`,
      a200: `hsla(217, 61%, 49%, ${opacity[500]})`,
      a400: `hsla(217, 61%, 49%, ${opacity[800]})`,
    },
    forest: {
      50: `hsla(175, 52%, 95%, ${opacity[1300]})`,
      100: `hsla(173, 55%, 90%, ${opacity[1300]})`,
      200: `hsla(174, 54%, 81%, ${opacity[1300]})`,
      300: `hsla(174, 54%, 71%, ${opacity[1300]})`,
      400: `hsla(174, 54%, 57%, ${opacity[1300]})`,
      500: `hsla(174, 81%, 40%, ${opacity[1300]})`,
      600: `hsla(174, 82%, 32%, ${opacity[1300]})`,
      700: `hsla(174, 82%, 26%, ${opacity[1300]})`,
      800: `hsla(173, 82%, 20%, ${opacity[1300]})`,
      900: `hsla(174, 83%, 14%, ${opacity[1300]})`,
      1000: `hsla(174, 84%, 10%, ${opacity[1300]})`,
      a50: `hsla(174, 82%, 32%, ${opacity[100]})`,
      a100: `hsla(174, 82%, 32%, ${opacity[300]})`,
      a150: `hsla(174, 82%, 32%, ${opacity[400]})`,
      a200: `hsla(174, 82%, 32%, ${opacity[500]})`,
      a400: `hsla(174, 82%, 32%, ${opacity[800]})`,
    },
    orchid: {
      50: `hsla(272, 87%, 97%, ${opacity[1300]})`,
      100: `hsla(270, 93%, 95%, ${opacity[1300]})`,
      200: `hsla(271, 89%, 89%, ${opacity[1300]})`,
      300: `hsla(271, 91%, 83%, ${opacity[1300]})`,
      400: `hsla(271, 91%, 75%, ${opacity[1300]})`,
      500: `hsla(270, 91%, 65%, ${opacity[1300]})`,
      600: `hsla(270, 56%, 53%, ${opacity[1300]})`,
      700: `hsla(270, 49%, 43%, ${opacity[1300]})`,
      800: `hsla(270, 49%, 32%, ${opacity[1300]})`,
      900: `hsla(271, 49%, 23%, ${opacity[1300]})`,
      1000: `hsla(272, 49%, 16%, ${opacity[1300]})`,
      a50: `hsla(270, 56%, 53%, ${opacity[100]})`,
      a100: `hsla(270, 56%, 53%, ${opacity[300]})`,
      a150: `hsla(270, 56%, 53%, ${opacity[400]})`,
      a200: `hsla(270, 56%, 53%, ${opacity[500]})`,
      a400: `hsla(270, 56%, 53%, ${opacity[800]})`,
    },
    magenta: {
      50: `hsla(328, 76%, 97%, ${opacity[1300]})`,
      100: `hsla(330, 81%, 94%, ${opacity[1300]})`,
      200: `hsla(331, 82%, 87%, ${opacity[1300]})`,
      300: `hsla(330, 80%, 81%, ${opacity[1300]})`,
      400: `hsla(330, 81%, 71%, ${opacity[1300]})`,
      500: `hsla(330, 80%, 60%, ${opacity[1300]})`,
      600: `hsla(330, 53%, 49%, ${opacity[1300]})`,
      700: `hsla(331, 53%, 40%, ${opacity[1300]})`,
      800: `hsla(330, 53%, 30%, ${opacity[1300]})`,
      900: `hsla(329, 54%, 21%, ${opacity[1300]})`,
      1000: `hsla(329, 55%, 15%, ${opacity[1300]})`,
      a50: `hsla(330, 53%, 49%, ${opacity[100]})`,
      a100: `hsla(330, 53%, 49%, ${opacity[300]})`,
      a150: `hsla(330, 53%, 49%, ${opacity[400]})`,
      a200: `hsla(330, 53%, 49%, ${opacity[500]})`,
      a400: `hsla(330, 53%, 49%, ${opacity[800]})`,
    },
    topaz: {
      50: `hsla(40, 90%, 96%, ${opacity[1300]})`,
      100: `hsla(40, 92%, 91%, ${opacity[1300]})`,
      200: `hsla(38, 94%, 81%, ${opacity[1300]})`,
      300: `hsla(36, 95%, 70%, ${opacity[1300]})`,
      400: `hsla(34, 95%, 59%, ${opacity[1300]})`,
      500: `hsla(32, 100%, 48%, ${opacity[1300]})`,
      600: `hsla(31, 100%, 41%, ${opacity[1300]})`,
      700: `hsla(31, 100%, 34%, ${opacity[1300]})`,
      800: `hsla(31, 100%, 27%, ${opacity[1300]})`,
      900: `hsla(31, 100%, 20%, ${opacity[1300]})`,
      1000: `hsla(31, 100%, 14%, ${opacity[1300]})`,
      a50: `hsla(32, 100%, 48%, ${opacity[100]})`,
      a100: `hsla(32, 100%, 48%, ${opacity[300]})`,
      a150: `hsla(32, 100%, 48%, ${opacity[400]})`,
      a200: `hsla(32, 100%, 48%, ${opacity[500]})`,
      a400: `hsla(32, 100%, 48%, ${opacity[800]})`,
    },
  },
  neutral: {
    blueGrayLight: {
      0: `hsla(0, 0%, 100%, ${opacity[1300]})`,
      50: `hsla(210, 40%, 98%, ${opacity[1300]})`,
      100: `hsla(210, 40%, 96%, ${opacity[1300]})`,
      200: `hsla(214, 32%, 91%, ${opacity[1300]})`,
      300: `hsla(213, 27%, 84%, ${opacity[1300]})`,
      400: `hsla(215, 20%, 65%, ${opacity[1300]})`,
      500: `hsla(215, 16%, 47%, ${opacity[1300]})`,
      600: `hsla(215, 19%, 35%, ${opacity[1300]})`,
      700: `hsla(215, 25%, 27%, ${opacity[1300]})`,
      800: `hsla(217, 33%, 17%, ${opacity[1300]})`,
      900: `hsla(222, 47%, 11%, ${opacity[1300]})`,
      1000: `hsla(220, 49%, 8%, ${opacity[1300]})`,
      1100: `hsla(218, 50%, 6%, ${opacity[1300]})`,
      1200: `hsla(229, 84%, 5%, ${opacity[1300]})`,
      1300: `hsla(216, 56%, 2%, ${opacity[1300]})`,
      a0: `hsla(0, 0%, 100%, ${opacity[0]})`,
      a1: `hsla(0, 0%, 100%, ${opacity[1]})`,
      a25: `hsla(0, 0%, 100%, ${opacity[600]})`,
      a48: `hsla(0, 0%, 100%, ${opacity[1200]})`,
      a50: `hsla(210, 40%, 98%, ${opacity[0]})`,
      a75: `hsla(210, 40%, 98%, ${opacity[600]})`,
      a100: `hsla(210, 40%, 96%, ${opacity[0]})`,
      a200: `hsla(214, 32%, 91%, ${opacity[0]})`,
      a230: `hsla(214, 32%, 91%, ${opacity[390]})`,
      a330: `hsla(213, 27%, 84%, ${opacity[390]})`,
      a400: `hsla(215, 20%, 65%, ${opacity[0]})`,
      a406: `hsla(215, 20%, 65%, ${opacity[50]})`,
      a500: `hsla(215, 16%, 47%, ${opacity[0]})`,
      a600: `hsla(215, 19%, 35%, ${opacity[0]})`,
      a700: `hsla(215, 25%, 27%, ${opacity[0]})`,
      a906: `hsla(222, 47%, 11%, ${opacity[50]})`,
      a900: `hsla(222, 47%, 11%, ${opacity[0]})`,
      a909: `hsla(222, 47%, 11%, ${opacity[100]})`,
      a912: `hsla(222, 47%, 11%, ${opacity[200]})`,
      a917: `hsla(222, 47%, 11%, ${opacity[225]})`,
      a918: `hsla(222, 47%, 11%, ${opacity[300]})`,
      a932: `hsla(222, 47%, 11%, ${opacity[500]})`,
      a964: `hsla(222, 47%, 11%, ${opacity[800]})`,
      a1072: `hsla(220, 49%, 8%, ${opacity[900]})`,
      a1106: `hsla(218, 50%, 6%, ${opacity[50]})`,
      a1264: `hsla(229, 84%, 5%, ${opacity[800]})`,
      a1288: `hsla(229, 84%, 5%, ${opacity[1100]})`,
    },
    blueGrayDark: {
      0: `hsla(0, 0%, 100%, ${opacity[1300]})`,
      50: `hsla(214, 32%, 91%, ${opacity[1300]})`,
      100: `hsla(213, 27%, 84%, ${opacity[1300]})`,
      200: `hsla(215, 20%, 65%, ${opacity[1300]})`,
      300: `hsla(215, 16%, 47%, ${opacity[1300]})`,
      400: `hsla(215, 19%, 35%, ${opacity[1300]})`,
      500: `hsla(215, 25%, 27%, ${opacity[1300]})`,
      600: `hsla(217, 33%, 17%, ${opacity[1300]})`,
      700: `hsla(217, 33%, 17%, ${opacity[1300]})`,
      800: `hsla(222, 47%, 11%, ${opacity[1300]})`,
      900: `hsla(220, 49%, 8%, ${opacity[1300]})`,
      1000: `hsla(218, 50%, 6%, ${opacity[1300]})`,
      1100: `hsla(229, 84%, 5%, ${opacity[1300]})`,
      1200: `hsla(216, 56%, 2%, ${opacity[1300]})`,
      1300: `hsla(222, 47%, 11%, ${opacity[1300]})`,
      a0: `hsla(0, 0%, 100%, ${opacity[0]})`,
      a1: `hsla(0, 0%, 100%, ${opacity[1]})`,
      a25: `hsla(0, 0%, 100%, ${opacity[600]})`,
      a48: `hsla(0, 0%, 100%, ${opacity[1200]})`,
      a50: `hsla(214, 32%, 91%, ${opacity[0]})`,
      a75: `hsla(214, 32%, 91%, ${opacity[600]})`,
      a100: `hsla(210, 40%, 96%, ${opacity[0]})`,
      a200: `hsla(215, 20%, 65%, ${opacity[0]})`,
      a300: `hsla(215, 16%, 47%, ${opacity[0]})`,
      a400: `hsla(215, 19%, 35%, ${opacity[0]})`,
      a500: `hsla(215, 25%, 27%, ${opacity[0]})`,
      a506: `hsla(215, 25%, 27%, ${opacity[50]})`,
      a509: `hsla(215, 25%, 27%, ${opacity[100]})`,
      a512: `hsla(215, 25%, 27%, ${opacity[200]})`,
      a518: `hsla(215, 25%, 27%, ${opacity[300]})`,
      a523: `hsla(215, 25%, 27%, ${opacity[325]})`,
      a532: `hsla(215, 25%, 27%, ${opacity[500]})`,
      a630: `hsla(217, 33%, 17%, ${opacity[390]})`,
      a830: `hsla(222, 47%, 11%, ${opacity[390]})`,
      a564: `hsla(215, 25%, 27%, ${opacity[800]})`,
      a572: `hsla(215, 25%, 27%, ${opacity[900]})`,
      a888: `hsla(222, 47%, 11%, ${opacity[1100]})`,
      a1188: `hsla(229, 84%, 5%, ${opacity[1100]})`,
      a1194: `hsla(229, 84%, 5%, ${opacity[1200]})`,
      a1312: `hsla(222, 47%, 11%, ${opacity[200]})`,
      a1388: `hsla(222, 47%, 11%, ${opacity[1100]})`,
    },
    ashGrayLight: {
      0: `hsla(0, 0%, 100%, ${opacity[1300]})`,
      50: `hsla(240, 9%, 98%, ${opacity[1300]})`,
      100: `hsla(210, 9%, 96%, ${opacity[1300]})`,
      200: `hsla(210, 6%, 94%, ${opacity[1300]})`,
      300: `hsla(210, 4%, 89%, ${opacity[1300]})`,
      400: `hsla(214, 7%, 81%, ${opacity[1300]})`,
      500: `hsla(216, 6%, 69%, ${opacity[1300]})`,
      600: `hsla(215, 6%, 60%, ${opacity[1300]})`,
      700: `hsla(214, 6%, 55%, ${opacity[1300]})`,
      800: `hsla(216, 7%, 45%, ${opacity[1300]})`,
      900: `hsla(218, 9%, 36%, ${opacity[1300]})`,
      1000: `hsla(219, 12%, 28%, ${opacity[1300]})`,
      1100: `hsla(214, 15%, 18%, ${opacity[1300]})`,
      1200: `hsla(216, 15%, 13%, ${opacity[1300]})`,
      1300: `hsla(214, 24%, 6%, ${opacity[1300]})`,
      a25: `hsla(214, 6%, 55%, ${opacity[50]})`,
      a50: `hsla(214, 6%, 55%, ${opacity[100]})`,
      a75: `hsla(214, 6%, 55%, ${opacity[200]})`,
      a100: `hsla(214, 6%, 55%, ${opacity[300]})`,
      a200: `hsla(214, 6%, 55%, ${opacity[500]})`,
      a400: `hsla(214, 6%, 55%, ${opacity[500]})`,
    },
    ashGrayDark: {
      0: `hsla(0, 0%, 99%, ${opacity[1300]})`,
      50: `hsla(240, 2%, 92%, ${opacity[1300]})`,
      100: `hsla(240, 1%, 84%, ${opacity[1300]})`,
      200: `hsla(228, 4%, 76%, ${opacity[1300]})`,
      300: `hsla(227, 4%, 60%, ${opacity[1300]})`,
      400: `hsla(229, 4%, 50%, ${opacity[1300]})`,
      500: `hsla(233, 4%, 40%, ${opacity[1300]})`,
      600: `hsla(233, 5%, 32%, ${opacity[1300]})`,
      700: `hsla(230, 6%, 22%, ${opacity[1300]})`,
      800: `hsla(230, 6%, 19%, ${opacity[1300]})`,
      900: `hsla(230, 7%, 17%, ${opacity[1300]})`,
      1000: `hsla(230, 8%, 15%, ${opacity[1300]})`,
      1100: `hsla(231, 12%, 12%, ${opacity[1300]})`,
      1200: `hsla(231, 17%, 8%, ${opacity[1300]})`,
      1300: `hsla(240, 5%, 4%, ${opacity[1300]})`,
      a25: `hsla(228, 4%, 76%, ${opacity[50]})`,
      a50: `hsla(228, 4%, 76%, ${opacity[100]})`,
      a75: `hsla(228, 4%, 76%, ${opacity[200]})`,
      a100: `hsla(228, 4%, 76%, ${opacity[300]})`,
      a200: `hsla(228, 4%, 76%, ${opacity[500]})`,
      a400: `hsla(228, 4%, 76%, ${opacity[500]})`,
    },
    white: {
      1: `hsla(0, 0%, 100%, ${opacity[1]})`,
      5: `hsla(0, 0%, 100%, ${opacity[50]})`,
      10: `hsla(0, 0%, 100%, ${opacity[100]})`,
      25: `hsla(0, 0%, 100%, ${opacity[200]})`,
      50: `hsla(0, 0%, 100%, ${opacity[300]})`,
      100: `hsla(0, 0%, 100%, ${opacity[500]})`,
      200: `hsla(0, 0%, 100%, ${opacity[600]})`,
      300: `hsla(0, 0%, 100%, ${opacity[800]})`,
      400: `hsla(0, 0%, 100%, ${opacity[1000]})`,
      450: `hsla(0, 0%, 100%, ${opacity[1100]})`,
      500: `hsla(0, 0%, 100%, ${opacity[1300]})`,
    },
    black: {
      1: `hsla(0, 0%, 0%, ${opacity[1]})`,
      5: `hsla(0, 0%, 0%, ${opacity[50]})`,
      10: `hsla(0, 0%, 0%, ${opacity[100]})`,
      25: `hsla(0, 0%, 0%, ${opacity[200]})`,
      50: `hsla(0, 0%, 0%, ${opacity[300]})`,
      100: `hsla(0, 0%, 0%, ${opacity[500]})`,
      200: `hsla(0, 0%, 0%, ${opacity[700]})`,
      300: `hsla(0, 0%, 0%, ${opacity[900]})`,
      400: `hsla(0, 0%, 0%, ${opacity[1000]})`,
      450: `hsla(0, 0%, 0%, ${opacity[1100]})`,
      500: `hsla(0, 0%, 0%, ${opacity[1300]})`,
    },
  },
};
