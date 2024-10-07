// import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/owl.carousel.min.css";
import "@/styles/bootstrap.min.css";
import "@/styles/all.css";
import "@/styles/custom.css";
import "@/styles/style.css";
import "@/styles/responsive.css";
import "@/styles/fonts/stylesheet.css";
import "@fortawesome/fontawesome-free/css/all.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserProvider from "./UserProvider";

// export const metadata: Metadata = {
//   title: "Voolay-Voo",
//   description: "Voolay Voo",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Header />
          {children}
          <Footer />
        </UserProvider>
      </body>

      <Script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" />
      <Script src="../js/jquery.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" />
      <Script src="../js/bootstrap.min.js" />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"
        strategy="afterInteractive"
      />
      <Script src="../js/counter.js" />
      <Script src="../js/wow.min.js" />
      <Script src="../js/index.js" />
    </html>
  );
}
