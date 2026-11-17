import AnnouncementBar from './AnnouncementBar.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

export default function Layout({ children }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      {children}
      <Footer />
    </>
  )
}
