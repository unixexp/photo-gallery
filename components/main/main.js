import styles from "./main.module.scss";
import { useEffect } from "react";

export default function Main({children, toggleTheme}) {

    return (
        <main>
            <div className="container">
                <button onClick={toggleTheme}>Theme</button>
                {children}
            </div>
        </main>
    );

}