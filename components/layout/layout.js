import styles from "./layout.module.scss";

import { useSelector } from 'react-redux';
import { selectTheme } from "../app/appSlice";

export default function Layout({children}) {

    const theme = useSelector(selectTheme);

    return <div className={`${styles.page} ${theme}`}>{children}</div>
}