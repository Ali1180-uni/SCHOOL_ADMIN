import Hero from "./hero.jsx";
import Navbar from "./navbar.jsx";
import Footer from "./footer.jsx";
import Image from "../assets/hero-image.gif";
function Home() {

  let HeroData = {
    title: "School Management System Admin Portal",
    subtitle: "We provide the best services for you.",
    imageUrl: Image
  };

  let Navs = {
    Home: "Home",
    Student_Data: "Student Data",
    Faculty: "Faculty Data"
  }

  let Links = {
    Website: "https://www.schoolmanagementsystem.com",
    Phone: "+1 (123) 456-7890",
    Email: "info@schoolmanagementsystem.com",
    instagram: "https://www.instagram.com/schoolmanagementsystem",
    facebook: "https://www.facebook.com/schoolmanagementsystem",
  }

  return (
    <div className = "Home" >
      <Navbar Navs={Navs} />
      <Hero heroData={HeroData} />
      <Footer  links={Links} />
    </div>
  )
}

export default Home