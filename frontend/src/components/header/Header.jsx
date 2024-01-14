import { useEffect, useState } from "react";
import styles from "./header.module.css";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";


const Header = () => {
  const [show, setShow] = useState(true);
  const router = useRouter()
  const pathname = router.pathname;
  const token = sessionStorage.getItem("token")
  const userDetails = JSON.parse(sessionStorage.getItem("user_details"))
  console.log("userDetails", pathname)

  useEffect(() => {

    if (pathname.toLowerCase() == "/" || pathname.toLowerCase() == "/login" || pathname.toLowerCase() == "/signup" || pathname.toLowerCase() == "/_error") {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [pathname]);

  return (
    <>
      {show ?
        <div className={styles.HeaderParent} >
          <div style={{ width: "99%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className={styles.heading}>
              Dashboard
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div>
                <h3 style={{ color: "#ff014f" }} >{userDetails?.username}</h3>
              </div>
              <div>
                {token ?
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={() => router.push('/login')}
                  >
                    Logout
                  </Button> : <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={() => router.push('/login')}
                  >
                    Login
                  </Button>}
              </div>
            </div>
          </div>
        </div> : <div></div>}
    </>
  )
}

export default Header