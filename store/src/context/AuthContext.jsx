import { createContext, useState,useEffect  } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {

  // Load from localStorage on first render
  const [user, setUser] = useState(() => 
    {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
    });

  //  Sync whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, 
   [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;


// function AuthProvider ({children}){
//     const [user, setUser] = useState(null);
//     return(
//         <AuthContext.Provider value={{user, setUser}}>
//             {children}
//         </AuthContext.Provider>
//     )
// }