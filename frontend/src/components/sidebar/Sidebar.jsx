import { useEffect, useState, useRef, } from "react";
import Link from "next/link"
import styles from "./sidebar.module.css";
import { useRouter } from "next/router";

const menuItems = [
  {
    name: "Crud Operations",
    to: "/crud-operations",
  },
  {
    name: "others",
    to: "/others",
  }
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = router.pathname;

  const [activeIndex, setActiveIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Find the index of the menu item with a matching "to" value
    const foundIndex = menuItems.findIndex((menuItem) => menuItem.to === pathname);

    // Update the activeIndex if a match is found
    if (foundIndex !== -1) {
      setActiveIndex(foundIndex);
    }

    if (pathname.toLowerCase() == "/" || pathname.toLowerCase() == "/login" || pathname.toLowerCase() == "/signup" || pathname.toLowerCase() == "/_error") {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [pathname]);

  return (
    <>
      {show ?
        <div className={styles.SidebarParent}>
          {menuItems.map((menuItem, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
            >
              <Link
                style={{ textDecoration: "none", color: "#fff" }}
                href={menuItem.to}
              >
                <div
                  className={`${styles.SidebarItem} ${index === activeIndex ? styles.active : ""
                    }`}
                >
                  <p>{menuItem.name}</p>
                </div>
              </Link>
            </div>
          ))}
        </div> : <div></div>}
    </>
  )
}

export default Sidebar