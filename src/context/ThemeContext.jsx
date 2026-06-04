import {
createContext,
useEffect,
useState
} from "react";

export const ThemeContext =
createContext();

function ThemeProvider({children}){

const [darkMode,setDarkMode]=
useState(

localStorage.getItem("theme")==="dark"

);

useEffect(()=>{

if(darkMode){

document.body.classList.add(

"dark-theme"

);

localStorage.setItem(

"theme",

"dark"

);

}

else{

document.body.classList.remove(

"dark-theme"

);

localStorage.setItem(

"theme",

"light"

);

}

},[darkMode]);

const toggleTheme=()=>{

setDarkMode(

prevMode => !prevMode

);

};

return(

<ThemeContext.Provider

value={{

darkMode,

toggleTheme

}}

>

{children}

</ThemeContext.Provider>

);

}

export default ThemeProvider;