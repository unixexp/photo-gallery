import styles from "./main.module.scss";

import { useSelector, useDispatch } from 'react-redux';
import { selectTheme, setTheme } from "../../app/appSlice";

export default function Main({children}) {

    const theme = useSelector(selectTheme);
    const dispatch = useDispatch();

    return (
        <main>
            <div className="container">
                <button onClick={() =>
                    theme == "dark"
                        ? dispatch(setTheme("light"))
                        : dispatch(setTheme("dark"))
                }>Theme</button>
                {children}
            </div>
        </main>
    );

}