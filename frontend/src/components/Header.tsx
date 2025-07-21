import { AppBar, Toolbar } from "@mui/material";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";

const Header = () => {
    const auth = useAuth();
    return (
        <AppBar sx={{ backgroundColor: "transparent", position: "static", boxShadow: "none" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Logo />
                <div>
                    {auth?.isLoggedIn ? (
                        <>
                            {
                                auth?.user?.isVerified ? (
                                    <NavigationLink to="/chat" text="Go To Chat " className="bg-cyan-400 text-black" />) :
                                    <NavigationLink to="/verified" text="Email Verify " className="bg-cyan-400 text-black" />
                            }
                            <NavigationLink
                                to="/login"
                                text="Logout"
                                className="bg-[#51538f] text-white"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    auth?.logout();
                                    window.location.href = "/login";
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <NavigationLink to="/login" text="Login" className="bg-cyan-400 text-black" />
                            <NavigationLink to="/signup" text="Signup" className="bg-[#51538f] text-white" />
                        </>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
