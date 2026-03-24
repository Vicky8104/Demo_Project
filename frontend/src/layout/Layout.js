import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Layout.css";

export default function Layout({ children, user, setUser, setOtpSent, setOtp }) {
  return (
    <div className="layout">
      <Header
        user={user}
        setUser={setUser}
        setOtpSent={setOtpSent}
        setOtp={setOtp}
      />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}