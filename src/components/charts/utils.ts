import {fontColorDark, fontColorLight, gridColorDark, gridColorLight} from "@/components/charts/constants";

export const getFontColor = (colorScheme: string) => colorScheme === "dark" ? fontColorLight : fontColorDark;
export const getGridColor = (colorScheme: string) => colorScheme === "dark" ? gridColorDark : gridColorLight;