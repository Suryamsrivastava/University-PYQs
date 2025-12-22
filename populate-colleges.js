// Script to populate database with 50 top Indian colleges
// Run this script to add college data to your database

import mongoose from 'mongoose';
import College from '../src/models/College.js';

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://padhaikarocare_db_user:4uop2PpYU54ehBaG@cluster0.6cthgaq.mongodb.net/?appName=Cluster0');
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error);
        process.exit(1);
    }
};

// Top 50 Indian Colleges Data
const collegesData = [
    // IITs (Indian Institutes of Technology)
    {
        name: "Indian Institute of Technology Bombay",
        shortName: "IIT Bombay",
        code: "IITB",
        type: "Government",
        category: "Technical",
        location: "Mumbai, Maharashtra",
        state: "Maharashtra",
        city: "Mumbai",
        establishedYear: 1958,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA", "M.Sc"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Aerospace Engineering"],
        website: "https://www.iitb.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Technology Delhi",
        shortName: "IIT Delhi",
        code: "IITD",
        type: "Government",
        category: "Technical",
        location: "New Delhi, Delhi",
        state: "Delhi",
        city: "New Delhi",
        establishedYear: 1961,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA", "M.Sc"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering"],
        website: "https://www.iitd.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Technology Madras",
        shortName: "IIT Madras",
        code: "IITM",
        type: "Government",
        category: "Technical",
        location: "Chennai, Tamil Nadu",
        state: "Tamil Nadu",
        city: "Chennai",
        establishedYear: 1959,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA", "M.Sc"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Ocean Engineering"],
        website: "https://www.iitm.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Technology Kanpur",
        shortName: "IIT Kanpur",
        code: "IITK",
        type: "Government",
        category: "Technical",
        location: "Kanpur, Uttar Pradesh",
        state: "Uttar Pradesh",
        city: "Kanpur",
        establishedYear: 1959,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA", "M.Sc"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Aerospace Engineering"],
        website: "https://www.iitk.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Technology Kharagpur",
        shortName: "IIT Kharagpur",
        code: "IITKGP",
        type: "Government",
        category: "Technical",
        location: "Kharagpur, West Bengal",
        state: "West Bengal",
        city: "Kharagpur",
        establishedYear: 1951,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA", "M.Sc"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Mining Engineering"],
        website: "https://www.iitkgp.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Technology Roorkee",
        shortName: "IIT Roorkee",
        code: "IITR",
        type: "Government",
        category: "Technical",
        location: "Roorkee, Uttarakhand",
        state: "Uttarakhand",
        city: "Roorkee",
        establishedYear: 1847,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA", "M.Sc"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Earthquake Engineering"],
        website: "https://www.iitr.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Technology Guwahati",
        shortName: "IIT Guwahati",
        code: "IITG",
        type: "Government",
        category: "Technical",
        location: "Guwahati, Assam",
        state: "Assam",
        city: "Guwahati",
        establishedYear: 1994,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA", "M.Sc"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Biotechnology"],
        website: "https://www.iitg.ac.in",
        status: "active"
    },

    // NITs (National Institutes of Technology)
    {
        name: "National Institute of Technology Trichy",
        shortName: "NIT Trichy",
        code: "NITT",
        type: "Government",
        category: "Technical",
        location: "Tiruchirappalli, Tamil Nadu",
        state: "Tamil Nadu",
        city: "Tiruchirappalli",
        establishedYear: 1964,
        affiliation: "NIT",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA", "M.Sc"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Electronics and Communication"],
        website: "https://www.nitt.edu",
        status: "active"
    },
    {
        name: "National Institute of Technology Warangal",
        shortName: "NIT Warangal",
        code: "NITW",
        type: "Government",
        category: "Technical",
        location: "Warangal, Telangana",
        state: "Telangana",
        city: "Warangal",
        establishedYear: 1959,
        affiliation: "NIT",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA", "M.Sc"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Electronics and Communication"],
        website: "https://www.nitw.ac.in",
        status: "active"
    },
    {
        name: "National Institute of Technology Karnataka",
        shortName: "NIT Karnataka",
        code: "NITK",
        type: "Government",
        category: "Technical",
        location: "Surathkal, Karnataka",
        state: "Karnataka",
        city: "Surathkal",
        establishedYear: 1960,
        affiliation: "NIT",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA", "M.Sc"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Information Technology"],
        website: "https://www.nitk.ac.in",
        status: "active"
    },

    // IIITs (Indian Institutes of Information Technology)
    {
        name: "International Institute of Information Technology Hyderabad",
        shortName: "IIIT Hyderabad",
        code: "IIITH",
        type: "Private",
        category: "Technical",
        location: "Hyderabad, Telangana",
        state: "Telangana",
        city: "Hyderabad",
        establishedYear: 1998,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD", "MS"],
        branches: ["Computer Science", "Electronics and Communication", "Computational Biology", "Data Science"],
        website: "https://www.iiit.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Information Technology Allahabad",
        shortName: "IIIT Allahabad",
        code: "IIITA",
        type: "Government",
        category: "Technical",
        location: "Prayagraj, Uttar Pradesh",
        state: "Uttar Pradesh",
        city: "Prayagraj",
        establishedYear: 1999,
        affiliation: "IIIT",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA"],
        branches: ["Information Technology", "Electronics and Communication", "Smart Manufacturing"],
        website: "https://www.iiita.ac.in",
        status: "active"
    },

    // Central Universities
    {
        name: "Jawaharlal Nehru University",
        shortName: "JNU",
        code: "JNU",
        type: "Government",
        category: "University",
        location: "New Delhi, Delhi",
        state: "Delhi",
        city: "New Delhi",
        establishedYear: 1969,
        affiliation: "Central University",
        courses: ["BA", "MA", "M.Sc", "PhD", "MCA"],
        branches: ["Arts", "Sciences", "Social Sciences", "Languages", "International Studies"],
        website: "https://www.jnu.ac.in",
        status: "active"
    },
    {
        name: "University of Delhi",
        shortName: "DU",
        code: "DU",
        type: "Government",
        category: "University",
        location: "New Delhi, Delhi",
        state: "Delhi",
        city: "New Delhi",
        establishedYear: 1922,
        affiliation: "Central University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "B.Com", "M.Com", "PhD"],
        branches: ["Arts", "Sciences", "Commerce", "Law", "Medicine"],
        website: "https://www.du.ac.in",
        status: "active"
    },
    {
        name: "Banaras Hindu University",
        shortName: "BHU",
        code: "BHU",
        type: "Government",
        category: "University",
        location: "Varanasi, Uttar Pradesh",
        state: "Uttar Pradesh",
        city: "Varanasi",
        establishedYear: 1916,
        affiliation: "Central University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "B.Tech", "M.Tech", "PhD"],
        branches: ["Arts", "Sciences", "Engineering", "Medicine", "Agriculture"],
        website: "https://www.bhu.ac.in",
        status: "active"
    },

    // Private Universities
    {
        name: "Birla Institute of Technology and Science Pilani",
        shortName: "BITS Pilani",
        code: "BITS",
        type: "Private",
        category: "Technical",
        location: "Pilani, Rajasthan",
        state: "Rajasthan",
        city: "Pilani",
        establishedYear: 1964,
        affiliation: "Deemed University",
        courses: ["B.E", "M.E", "M.Sc", "PhD", "MBA"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Electronics and Instrumentation"],
        website: "https://www.bits-pilani.ac.in",
        status: "active"
    },
    {
        name: "Vellore Institute of Technology",
        shortName: "VIT",
        code: "VIT",
        type: "Private",
        category: "Technical",
        location: "Vellore, Tamil Nadu",
        state: "Tamil Nadu",
        city: "Vellore",
        establishedYear: 1984,
        affiliation: "Deemed University",
        courses: ["B.Tech", "M.Tech", "MBA", "MCA", "PhD"],
        branches: ["Computer Science", "Information Technology", "Electronics and Communication", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering"],
        website: "https://www.vit.ac.in",
        status: "active"
    },
    {
        name: "SRM Institute of Science and Technology",
        shortName: "SRM University",
        code: "SRM",
        type: "Private",
        category: "Technical",
        location: "Chennai, Tamil Nadu",
        state: "Tamil Nadu",
        city: "Chennai",
        establishedYear: 1985,
        affiliation: "Deemed University",
        courses: ["B.Tech", "M.Tech", "MBA", "MCA", "PhD"],
        branches: ["Computer Science", "Information Technology", "Electronics and Communication", "Mechanical Engineering", "Civil Engineering", "Biotechnology"],
        website: "https://www.srmist.edu.in",
        status: "active"
    },
    {
        name: "Manipal Academy of Higher Education",
        shortName: "Manipal University",
        code: "MAHE",
        type: "Private",
        category: "Medical/Technical",
        location: "Manipal, Karnataka",
        state: "Karnataka",
        city: "Manipal",
        establishedYear: 1953,
        affiliation: "Deemed University",
        courses: ["MBBS", "B.Tech", "MBA", "BDS", "PhD"],
        branches: ["Medicine", "Engineering", "Dentistry", "Pharmacy", "Allied Health Sciences"],
        website: "https://manipal.edu",
        status: "active"
    },

    // State Universities
    {
        name: "Anna University",
        shortName: "Anna University",
        code: "AU",
        type: "Government",
        category: "Technical",
        location: "Chennai, Tamil Nadu",
        state: "Tamil Nadu",
        city: "Chennai",
        establishedYear: 1978,
        affiliation: "State University",
        courses: ["B.E", "M.E", "M.Tech", "PhD", "MBA"],
        branches: ["Computer Science", "Information Technology", "Electronics and Communication", "Mechanical Engineering", "Civil Engineering"],
        website: "https://www.annauniv.edu",
        status: "active"
    },
    {
        name: "University of Mumbai",
        shortName: "Mumbai University",
        code: "MU",
        type: "Government",
        category: "University",
        location: "Mumbai, Maharashtra",
        state: "Maharashtra",
        city: "Mumbai",
        establishedYear: 1857,
        affiliation: "State University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "B.Com", "M.Com", "B.E", "PhD"],
        branches: ["Arts", "Sciences", "Commerce", "Engineering", "Law", "Medicine"],
        website: "https://mu.ac.in",
        status: "active"
    },
    {
        name: "University of Pune",
        shortName: "Pune University",
        code: "PU",
        type: "Government",
        category: "University",
        location: "Pune, Maharashtra",
        state: "Maharashtra",
        city: "Pune",
        establishedYear: 1949,
        affiliation: "State University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "B.Com", "M.Com", "B.E", "PhD"],
        branches: ["Arts", "Sciences", "Commerce", "Engineering", "Management"],
        website: "http://www.unipune.ac.in",
        status: "active"
    },
    {
        name: "University of Calcutta",
        shortName: "Calcutta University",
        code: "CU",
        type: "Government",
        category: "University",
        location: "Kolkata, West Bengal",
        state: "West Bengal",
        city: "Kolkata",
        establishedYear: 1857,
        affiliation: "State University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "B.Com", "M.Com", "PhD"],
        branches: ["Arts", "Sciences", "Commerce", "Law", "Fine Arts"],
        website: "https://www.caluniv.ac.in",
        status: "active"
    },

    // Medical Colleges
    {
        name: "All India Institute of Medical Sciences Delhi",
        shortName: "AIIMS Delhi",
        code: "AIIMS",
        type: "Government",
        category: "Medical",
        location: "New Delhi, Delhi",
        state: "Delhi",
        city: "New Delhi",
        establishedYear: 1956,
        affiliation: "Institute of National Importance",
        courses: ["MBBS", "MD", "MS", "PhD", "B.Sc Nursing"],
        branches: ["Medicine", "Surgery", "Pediatrics", "Gynecology", "Anesthesiology", "Radiology"],
        website: "https://www.aiims.edu",
        status: "active"
    },
    {
        name: "Christian Medical College Vellore",
        shortName: "CMC Vellore",
        code: "CMC",
        type: "Private",
        category: "Medical",
        location: "Vellore, Tamil Nadu",
        state: "Tamil Nadu",
        city: "Vellore",
        establishedYear: 1900,
        affiliation: "Deemed University",
        courses: ["MBBS", "MD", "MS", "PhD", "B.Sc Nursing"],
        branches: ["Medicine", "Surgery", "Pediatrics", "Gynecology", "Community Health"],
        website: "https://www.cmch-vellore.edu",
        status: "active"
    },
    {
        name: "Armed Forces Medical College",
        shortName: "AFMC",
        code: "AFMC",
        type: "Government",
        category: "Medical",
        location: "Pune, Maharashtra",
        state: "Maharashtra",
        city: "Pune",
        establishedYear: 1948,
        affiliation: "Deemed University",
        courses: ["MBBS", "MD", "MS"],
        branches: ["Medicine", "Surgery", "Preventive Medicine", "Aerospace Medicine"],
        website: "https://www.afmc.nic.in",
        status: "active"
    },

    // Management Institutes
    {
        name: "Indian Institute of Management Ahmedabad",
        shortName: "IIM Ahmedabad",
        code: "IIMA",
        type: "Government",
        category: "Management",
        location: "Ahmedabad, Gujarat",
        state: "Gujarat",
        city: "Ahmedabad",
        establishedYear: 1961,
        affiliation: "Institute of National Importance",
        courses: ["MBA", "PhD", "Executive MBA", "Fellow Programme"],
        branches: ["Finance", "Marketing", "Operations", "Strategy", "Human Resources"],
        website: "https://www.iima.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Management Bangalore",
        shortName: "IIM Bangalore",
        code: "IIMB",
        type: "Government",
        category: "Management",
        location: "Bangalore, Karnataka",
        state: "Karnataka",
        city: "Bangalore",
        establishedYear: 1973,
        affiliation: "Institute of National Importance",
        courses: ["MBA", "PhD", "Executive MBA", "Fellow Programme"],
        branches: ["Finance", "Marketing", "Operations", "Strategy", "Information Systems"],
        website: "https://www.iimb.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Management Calcutta",
        shortName: "IIM Calcutta",
        code: "IIMC",
        type: "Government",
        category: "Management",
        location: "Kolkata, West Bengal",
        state: "West Bengal",
        city: "Kolkata",
        establishedYear: 1961,
        affiliation: "Institute of National Importance",
        courses: ["MBA", "PhD", "Executive MBA", "Fellow Programme"],
        branches: ["Finance", "Marketing", "Operations", "Strategy", "Economics"],
        website: "https://www.iimcal.ac.in",
        status: "active"
    },

    // Additional Technical Institutes
    {
        name: "Indian Statistical Institute",
        shortName: "ISI",
        code: "ISI",
        type: "Government",
        category: "Research Institute",
        location: "Kolkata, West Bengal",
        state: "West Bengal",
        city: "Kolkata",
        establishedYear: 1931,
        affiliation: "Institute of National Importance",
        courses: ["B.Stat", "B.Math", "M.Stat", "M.Math", "PhD"],
        branches: ["Statistics", "Mathematics", "Computer Science", "Economics", "Quality Control"],
        website: "https://www.isical.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Science",
        shortName: "IISc",
        code: "IISC",
        type: "Government",
        category: "Research Institute",
        location: "Bangalore, Karnataka",
        state: "Karnataka",
        city: "Bangalore",
        establishedYear: 1909,
        affiliation: "Institute of National Importance",
        courses: ["M.Tech", "PhD", "Integrated PhD"],
        branches: ["Aerospace Engineering", "Computer Science", "Electrical Engineering", "Materials Engineering", "Biological Sciences"],
        website: "https://www.iisc.ac.in",
        status: "active"
    },

    // Additional Private Colleges
    {
        name: "Amity University",
        shortName: "Amity",
        code: "AMITY",
        type: "Private",
        category: "University",
        location: "Noida, Uttar Pradesh",
        state: "Uttar Pradesh",
        city: "Noida",
        establishedYear: 2005,
        affiliation: "Private University",
        courses: ["B.Tech", "MBA", "BBA", "BCA", "PhD"],
        branches: ["Engineering", "Management", "Computer Applications", "Applied Sciences", "Fine Arts"],
        website: "https://www.amity.edu",
        status: "active"
    },
    {
        name: "Lovely Professional University",
        shortName: "LPU",
        code: "LPU",
        type: "Private",
        category: "University",
        location: "Phagwara, Punjab",
        state: "Punjab",
        city: "Phagwara",
        establishedYear: 2005,
        affiliation: "Private University",
        courses: ["B.Tech", "MBA", "BBA", "BCA", "B.Sc", "PhD"],
        branches: ["Engineering", "Management", "Computer Applications", "Agriculture", "Pharmacy"],
        website: "https://www.lpu.in",
        status: "active"
    },
    {
        name: "Symbiosis International University",
        shortName: "SIU",
        code: "SIU",
        type: "Private",
        category: "University",
        location: "Pune, Maharashtra",
        state: "Maharashtra",
        city: "Pune",
        establishedYear: 1971,
        affiliation: "Deemed University",
        courses: ["MBA", "B.Tech", "BBA", "Law", "PhD"],
        branches: ["Management", "Engineering", "Law", "Media & Communication", "International Business"],
        website: "https://www.siu.edu.in",
        status: "active"
    },

    // Additional Government Colleges
    {
        name: "Jadavpur University",
        shortName: "JU",
        code: "JU",
        type: "Government",
        category: "University",
        location: "Kolkata, West Bengal",
        state: "West Bengal",
        city: "Kolkata",
        establishedYear: 1955,
        affiliation: "State University",
        courses: ["B.E", "M.E", "B.Sc", "M.Sc", "BA", "MA", "PhD"],
        branches: ["Engineering", "Sciences", "Arts", "Architecture"],
        website: "http://www.jaduniv.edu.in",
        status: "active"
    },
    {
        name: "Aligarh Muslim University",
        shortName: "AMU",
        code: "AMU",
        type: "Government",
        category: "University",
        location: "Aligarh, Uttar Pradesh",
        state: "Uttar Pradesh",
        city: "Aligarh",
        establishedYear: 1920,
        affiliation: "Central University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "B.Tech", "M.Tech", "MBBS", "PhD"],
        branches: ["Arts", "Sciences", "Engineering", "Medicine", "Law", "Management"],
        website: "https://www.amu.ac.in",
        status: "active"
    },
    {
        name: "Jamia Millia Islamia",
        shortName: "JMI",
        code: "JMI",
        type: "Government",
        category: "University",
        location: "New Delhi, Delhi",
        state: "Delhi",
        city: "New Delhi",
        establishedYear: 1920,
        affiliation: "Central University",
        courses: ["BA", "MA", "B.Tech", "M.Tech", "MBA", "PhD"],
        branches: ["Arts", "Engineering", "Architecture", "Management", "Mass Communication"],
        website: "https://www.jmi.ac.in",
        status: "active"
    },

    // Specialized Institutes
    {
        name: "National Institute of Design",
        shortName: "NID",
        code: "NID",
        type: "Government",
        category: "Design",
        location: "Ahmedabad, Gujarat",
        state: "Gujarat",
        city: "Ahmedabad",
        establishedYear: 1961,
        affiliation: "Institute of National Importance",
        courses: ["B.Des", "M.Des", "PhD"],
        branches: ["Product Design", "Communication Design", "Textile Design", "Animation", "Film & Video Communication"],
        website: "https://www.nid.edu",
        status: "active"
    },
    {
        name: "National Institute of Fashion Technology",
        shortName: "NIFT",
        code: "NIFT",
        type: "Government",
        category: "Fashion/Design",
        location: "New Delhi, Delhi",
        state: "Delhi",
        city: "New Delhi",
        establishedYear: 1986,
        affiliation: "Statutory Institute",
        courses: ["B.Des", "M.Des", "B.FTech", "M.FTech", "MBA"],
        branches: ["Fashion Design", "Textile Design", "Fashion Technology", "Fashion Communication", "Knitwear Design"],
        website: "https://www.nift.ac.in",
        status: "active"
    },

    // Additional Regional Universities
    {
        name: "Osmania University",
        shortName: "OU",
        code: "OU",
        type: "Government",
        category: "University",
        location: "Hyderabad, Telangana",
        state: "Telangana",
        city: "Hyderabad",
        establishedYear: 1918,
        affiliation: "State University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "B.Com", "M.Com", "B.E", "PhD"],
        branches: ["Arts", "Sciences", "Commerce", "Engineering", "Law", "Medicine"],
        website: "https://www.osmania.ac.in",
        status: "active"
    },
    {
        name: "University of Madras",
        shortName: "Madras University",
        code: "UNOM",
        type: "Government",
        category: "University",
        location: "Chennai, Tamil Nadu",
        state: "Tamil Nadu",
        city: "Chennai",
        establishedYear: 1857,
        affiliation: "State University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "B.Com", "M.Com", "PhD"],
        branches: ["Arts", "Sciences", "Commerce", "Management", "Information Science"],
        website: "https://www.unom.ac.in",
        status: "active"
    },
    {
        name: "Guru Gobind Singh Indraprastha University",
        shortName: "GGSIPU",
        code: "IPU",
        type: "Government",
        category: "University",
        location: "New Delhi, Delhi",
        state: "Delhi",
        city: "New Delhi",
        establishedYear: 1998,
        affiliation: "State University",
        courses: ["B.Tech", "MBA", "BBA", "BCA", "Law", "PhD"],
        branches: ["Engineering", "Management", "Computer Applications", "Law", "Medical Sciences"],
        website: "http://www.ipu.ac.in",
        status: "active"
    },

    // Additional Private Institutions
    {
        name: "Kalinga Institute of Industrial Technology",
        shortName: "KIIT University",
        code: "KIIT",
        type: "Private",
        category: "University",
        location: "Bhubaneswar, Odisha",
        state: "Odisha",
        city: "Bhubaneswar",
        establishedYear: 1992,
        affiliation: "Deemed University",
        courses: ["B.Tech", "MBA", "BBA", "Law", "PhD"],
        branches: ["Engineering", "Management", "Law", "Medicine", "Biotechnology"],
        website: "https://kiit.ac.in",
        status: "active"
    },
    {
        name: "Thapar Institute of Engineering and Technology",
        shortName: "Thapar University",
        code: "TIET",
        type: "Private",
        category: "Technical",
        location: "Patiala, Punjab",
        state: "Punjab",
        city: "Patiala",
        establishedYear: 1956,
        affiliation: "Deemed University",
        courses: ["B.E", "M.E", "MBA", "PhD"],
        branches: ["Computer Science", "Electronics and Communication", "Mechanical Engineering", "Chemical Engineering", "Civil Engineering"],
        website: "https://www.thapar.edu",
        status: "active"
    },
    {
        name: "Shiv Nadar University",
        shortName: "SNU",
        code: "SNU",
        type: "Private",
        category: "University",
        location: "Greater Noida, Uttar Pradesh",
        state: "Uttar Pradesh",
        city: "Greater Noida",
        establishedYear: 2011,
        affiliation: "Private University",
        courses: ["B.Tech", "MBA", "B.Sc", "MA", "PhD"],
        branches: ["Engineering", "Management", "Natural Sciences", "Humanities", "Social Sciences"],
        website: "https://snu.edu.in",
        status: "active"
    },

    // Final additions to reach 50
    {
        name: "Rajiv Gandhi University of Health Sciences",
        shortName: "RGUHS",
        code: "RGUHS",
        type: "Government",
        category: "Medical",
        location: "Bangalore, Karnataka",
        state: "Karnataka",
        city: "Bangalore",
        establishedYear: 1996,
        affiliation: "State University",
        courses: ["MBBS", "BDS", "B.Pharmacy", "B.Sc Nursing", "MD", "MS"],
        branches: ["Medicine", "Dentistry", "Pharmacy", "Nursing", "Allied Health Sciences"],
        website: "https://www.rguhs.ac.in",
        status: "active"
    },
    {
        name: "Cochin University of Science and Technology",
        shortName: "CUSAT",
        code: "CUSAT",
        type: "Government",
        category: "Technical",
        location: "Kochi, Kerala",
        state: "Kerala",
        city: "Kochi",
        establishedYear: 1971,
        affiliation: "State University",
        courses: ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "PhD"],
        branches: ["Computer Science", "Electronics", "Mechanical Engineering", "Marine Sciences", "Biotechnology"],
        website: "https://cusat.ac.in",
        status: "active"
    },
    {
        name: "Bharathiar University",
        shortName: "BU",
        code: "BU",
        type: "Government",
        category: "University",
        location: "Coimbatore, Tamil Nadu",
        state: "Tamil Nadu",
        city: "Coimbatore",
        establishedYear: 1982,
        affiliation: "State University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "MBA", "PhD"],
        branches: ["Arts", "Sciences", "Commerce", "Management", "Computer Applications"],
        website: "http://b-u.ac.in",
        status: "active"
    }
];

// Function to populate database
const populateColleges = async () => {
    try {
        // Clear existing colleges (optional - comment out if you want to keep existing data)
        // await College.deleteMany({});
        // console.log('🗑️  Cleared existing college data');

        // Insert new colleges
        console.log('📝 Inserting college data...');

        let insertedCount = 0;
        let skippedCount = 0;

        for (const collegeData of collegesData) {
            try {
                // Check if college already exists
                const existingCollege = await College.findOne({
                    $or: [
                        { code: collegeData.code },
                        { name: collegeData.name }
                    ]
                });

                if (existingCollege) {
                    console.log(`⚠️  Skipping ${collegeData.name} - already exists`);
                    skippedCount++;
                    continue;
                }

                const college = new College(collegeData);
                await college.save();
                console.log(`✅ Added: ${collegeData.name}`);
                insertedCount++;
            } catch (error) {
                console.error(`❌ Error adding ${collegeData.name}:`, error.message);
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`✅ Successfully inserted: ${insertedCount} colleges`);
        console.log(`⚠️  Skipped (already exist): ${skippedCount} colleges`);
        console.log(`📝 Total colleges in dataset: ${collegesData.length}`);

    } catch (error) {
        console.error('❌ Error populating colleges:', error);
    }
};

// Main execution function
const main = async () => {
    console.log('🚀 Starting college data population...\n');

    await connectDB();
    await populateColleges();

    console.log('\n✅ College data population completed!');
    console.log('🔍 You can now view the colleges in your database');

    process.exit(0);
};

// Run the script
main().catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
});

export default main;