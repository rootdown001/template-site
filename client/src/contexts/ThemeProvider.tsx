import { THEME_OPTIONS } from "@/constants/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ReactNode, createContext } from "react";

// 8.   create options for our theme variable in []
// CODEGPT "as const assertion is used to infer the narrowest possible
// type for the array, making each element a literal type instead of a string type."
//  Export to use other places

// then moved to constans.ts & import above
// export const THEME_OPTIONS = ["light", "dark", "system"] as const;

// Define Theme type
//  so Theme is type of THEME_OPTIONS and [number] is index type query
// in typescript
type Theme = (typeof THEME_OPTIONS)[number];

// 2. Create type for ThemeProviderProps
// set to ReactNode, generic type allowing you
// to accept any valid react component or jsx

type ThemeProviderProps = {
  children: ReactNode;
};

// 5. define type for our context
// Need theme, setTheme, and isDark
// Define setTheme function - CODEGPT "The setTheme function is a method
// that belongs to the ThemeContext object. It is a callback function that
// takes a theme argument of type Theme and returns nothing (void). The purpose
// of the setTheme function is to allow components that consume the ThemeContext
// to change the theme dynamically."

type ThemeContext = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
};

// 3. createContext (OUTSIDE of function)
// set to null - the way to start in React
// 6. Add type of ThemeContext to our create context -
export const Context = createContext<ThemeContext | null>(null);

// 1. create component to hold theme context
// Takes in children
// TYPE ThemeProviderProps

export function ThemeProvider({ children }: ThemeProviderProps) {
  // 9. Logic - save theme to local storage - useLocalStorage hook
  // sending key of THEME and initial value of "system" (if not in local
  // storage already)
  // Gibe type of Theme

  const [theme, setTheme] = useLocalStorage<Theme>("THEME", "system");

  // 10. create changeTheme function to call for setTheme
  // Receives theme (current theme) of type Theme
  // Get code for changing theme from initial index.html
  // Function works by getting theme, changing class of dark in document and setting theme to local storage
  function changeTheme(theme: Theme) {
    // Determin isDark - if theme === dark OR
    // if system preference is set to dark
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        matchMedia("(prefers-color-scheme: dark)").matches);

    // set dark class on document element - if we are in dark mode
    // CODEGPT: "In other words, this code is used to switch between a
    // light theme and a dark theme by adding or removing the "dark" class from the <html> element."
    document.documentElement.classList.toggle("dark", isDark);

    // call setTheme to store in local storage
    setTheme(theme);
  }

  // 4. return children wrapped in Context.Provider
  // 7. add our values to Context.Provider in object {}
  return (
    <Context.Provider
      value={{
        theme,
        setTheme: changeTheme,
        // isDark: if document class has "dark"
        isDark: document.documentElement.classList.contains("dark"),
      }}
    >
      {children}
    </Context.Provider>
  );
}
