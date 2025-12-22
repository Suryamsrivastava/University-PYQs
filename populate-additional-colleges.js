const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://padhaikarocare_db_user:4uop2PpYU54ehBaG@cluster0.6cthgaq.mongodb.net/?appName=Cluster0');
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error);
        process.exit(1);
    }
};

// College Schema
const CollegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    shortName: {
        type: String,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        uppercase: true
    },
    address: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    establishedYear: {
        type: Number,
        min: 1800,
        max: new Date().getFullYear()
    },
    type: {
        type: String,
        enum: ['Government', 'Private', 'Autonomous', 'government', 'private', 'autonomous'],
        required: true
    },
    category: {
        type: String,
        enum: ['Technical', 'Medical', 'Management', 'University', 'Research Institute', 'Design', 'Fashion/Design'],
        trim: true
    },
    affiliation: {
        type: String,
        trim: true
    },
    courses: [{
        type: String,
        trim: true
    }],
    branches: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const College = mongoose.model('College', CollegeSchema);

// Additional 50+ Indian Colleges Data (Batch 2)
const additionalCollegesData = [
    // Additional IITs
    {
        name: "Indian Institute of Technology Hyderabad",
        shortName: "IIT Hyderabad",
        code: "IITH2",
        type: "Government",
        category: "Technical",
        location: "Hyderabad, Telangana",
        state: "Telangana",
        city: "Hyderabad",
        establishedYear: 2008,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA", "M.Sc"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Biotechnology"],
        website: "https://www.iith.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Technology Bhubaneswar",
        shortName: "IIT Bhubaneswar",
        code: "IITBBS",
        type: "Government",
        category: "Technical",
        location: "Bhubaneswar, Odisha",
        state: "Odisha",
        city: "Bhubaneswar",
        establishedYear: 2008,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Metallurgical Engineering"],
        website: "https://www.iitbbs.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Technology Gandhinagar",
        shortName: "IIT Gandhinagar",
        code: "IITGN",
        type: "Government",
        category: "Technical",
        location: "Gandhinagar, Gujarat",
        state: "Gujarat",
        city: "Gandhinagar",
        establishedYear: 2008,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering"],
        website: "https://www.iitgn.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Technology Mandi",
        shortName: "IIT Mandi",
        code: "IITMANDI",
        type: "Government",
        category: "Technical",
        location: "Mandi, Himachal Pradesh",
        state: "Himachal Pradesh",
        city: "Mandi",
        establishedYear: 2009,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Data Science"],
        website: "https://www.iitmandi.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Technology Indore",
        shortName: "IIT Indore",
        code: "IITI",
        type: "Government",
        category: "Technical",
        location: "Indore, Madhya Pradesh",
        state: "Madhya Pradesh",
        city: "Indore",
        establishedYear: 2009,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Metallurgy"],
        website: "https://www.iiti.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Technology Patna",
        shortName: "IIT Patna",
        code: "IITP",
        type: "Government",
        category: "Technical",
        location: "Patna, Bihar",
        state: "Bihar",
        city: "Patna",
        establishedYear: 2008,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering"],
        website: "https://www.iitp.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Technology Jodhpur",
        shortName: "IIT Jodhpur",
        code: "IITJ",
        type: "Government",
        category: "Technical",
        location: "Jodhpur, Rajasthan",
        state: "Rajasthan",
        city: "Jodhpur",
        establishedYear: 2008,
        affiliation: "Autonomous",
        courses: ["B.Tech", "M.Tech", "PhD"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Artificial Intelligence"],
        website: "https://www.iitj.ac.in",
        status: "active"
    },

    // Additional NITs
    {
        name: "National Institute of Technology Rourkela",
        shortName: "NIT Rourkela",
        code: "NITR",
        type: "Government",
        category: "Technical",
        location: "Rourkela, Odisha",
        state: "Odisha",
        city: "Rourkela",
        establishedYear: 1961,
        affiliation: "NIT",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA", "MCA"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Mining Engineering"],
        website: "https://www.nitrkl.ac.in",
        status: "active"
    },
    {
        name: "National Institute of Technology Calicut",
        shortName: "NIT Calicut",
        code: "NITC",
        type: "Government",
        category: "Technical",
        location: "Kozhikode, Kerala",
        state: "Kerala",
        city: "Kozhikode",
        establishedYear: 1961,
        affiliation: "NIT",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA", "MCA"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Electronics and Communication"],
        website: "https://www.nitc.ac.in",
        status: "active"
    },
    {
        name: "National Institute of Technology Durgapur",
        shortName: "NIT Durgapur",
        code: "NITDGP",
        type: "Government",
        category: "Technical",
        location: "Durgapur, West Bengal",
        state: "West Bengal",
        city: "Durgapur",
        establishedYear: 1960,
        affiliation: "NIT",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA", "MCA"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Metallurgy"],
        website: "https://www.nitdgp.ac.in",
        status: "active"
    },
    {
        name: "National Institute of Technology Jamshedpur",
        shortName: "NIT Jamshedpur",
        code: "NITJSR",
        type: "Government",
        category: "Technical",
        location: "Jamshedpur, Jharkhand",
        state: "Jharkhand",
        city: "Jamshedpur",
        establishedYear: 1960,
        affiliation: "NIT",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Metallurgy", "Production Engineering"],
        website: "https://www.nitjsr.ac.in",
        status: "active"
    },
    {
        name: "National Institute of Technology Kurukshetra",
        shortName: "NIT Kurukshetra",
        code: "NITKKR",
        type: "Government",
        category: "Technical",
        location: "Kurukshetra, Haryana",
        state: "Haryana",
        city: "Kurukshetra",
        establishedYear: 1963,
        affiliation: "NIT",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Electronics and Communication"],
        website: "https://www.nitkkr.ac.in",
        status: "active"
    },
    {
        name: "National Institute of Technology Surat",
        shortName: "NIT Surat",
        code: "SVNIT",
        type: "Government",
        category: "Technical",
        location: "Surat, Gujarat",
        state: "Gujarat",
        city: "Surat",
        establishedYear: 1961,
        affiliation: "NIT",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA"],
        branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Chemistry"],
        website: "https://www.svnit.ac.in",
        status: "active"
    },

    // Additional IIITs
    {
        name: "Indian Institute of Information Technology Bangalore",
        shortName: "IIIT Bangalore",
        code: "IIITB",
        type: "Government",
        category: "Technical",
        location: "Bangalore, Karnataka",
        state: "Karnataka",
        city: "Bangalore",
        establishedYear: 1999,
        affiliation: "IIIT",
        courses: ["M.Tech", "PhD", "MS"],
        branches: ["Computer Science", "Electronics and Communication", "Information Technology"],
        website: "https://www.iiitb.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Information Technology Gwalior",
        shortName: "IIIT Gwalior",
        code: "IIITM",
        type: "Government",
        category: "Technical",
        location: "Gwalior, Madhya Pradesh",
        state: "Madhya Pradesh",
        city: "Gwalior",
        establishedYear: 1997,
        affiliation: "IIIT",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA"],
        branches: ["Information Technology", "Computer Science", "Electronics and Communication"],
        website: "https://www.iiitm.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Information Technology Jabalpur",
        shortName: "IIIT Jabalpur",
        code: "IIITDMJ",
        type: "Government",
        category: "Technical",
        location: "Jabalpur, Madhya Pradesh",
        state: "Madhya Pradesh",
        city: "Jabalpur",
        establishedYear: 2005,
        affiliation: "IIIT",
        courses: ["B.Tech", "M.Tech", "PhD"],
        branches: ["Computer Science", "Electronics and Communication", "Mechanical Engineering"],
        website: "https://www.iiitdmj.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Information Technology Kancheepuram",
        shortName: "IIIT Kancheepuram",
        code: "IIITDM",
        type: "Government",
        category: "Technical",
        location: "Chennai, Tamil Nadu",
        state: "Tamil Nadu",
        city: "Chennai",
        establishedYear: 2007,
        affiliation: "IIIT",
        courses: ["B.Tech", "M.Tech", "PhD"],
        branches: ["Computer Science", "Electronics and Communication", "Mechanical Engineering"],
        website: "https://www.iiitdm.ac.in",
        status: "active"
    },

    // Additional Central Universities
    {
        name: "Jamia Hamdard University",
        shortName: "Jamia Hamdard",
        code: "JH",
        type: "Government",
        category: "University",
        location: "New Delhi, Delhi",
        state: "Delhi",
        city: "New Delhi",
        establishedYear: 1989,
        affiliation: "Deemed University",
        courses: ["MBBS", "B.Pharm", "M.Pharm", "PhD", "MBA"],
        branches: ["Medicine", "Pharmacy", "Nursing", "Management", "Engineering"],
        website: "https://www.jamiahamdard.ac.in",
        status: "active"
    },
    {
        name: "Hemvati Nandan Bahuguna Garhwal University",
        shortName: "HNB Garhwal University",
        code: "HNBGU",
        type: "Government",
        category: "University",
        location: "Srinagar, Uttarakhand",
        state: "Uttarakhand",
        city: "Srinagar",
        establishedYear: 1973,
        affiliation: "Central University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "PhD"],
        branches: ["Arts", "Sciences", "Commerce", "Management"],
        website: "https://www.hnbgu.ac.in",
        status: "active"
    },
    {
        name: "Rajiv Gandhi University",
        shortName: "RGU",
        code: "RGU",
        type: "Government",
        category: "University",
        location: "Itanagar, Arunachal Pradesh",
        state: "Arunachal Pradesh",
        city: "Itanagar",
        establishedYear: 1985,
        affiliation: "Central University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "B.Tech", "PhD"],
        branches: ["Arts", "Sciences", "Engineering", "Management"],
        website: "https://www.rgu.ac.in",
        status: "active"
    },
    {
        name: "Central University of Haryana",
        shortName: "CUH",
        code: "CUH",
        type: "Government",
        category: "University",
        location: "Mahendergarh, Haryana",
        state: "Haryana",
        city: "Mahendergarh",
        establishedYear: 2009,
        affiliation: "Central University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "PhD"],
        branches: ["Arts", "Sciences", "Commerce", "Management", "Law"],
        website: "https://www.cuh.ac.in",
        status: "active"
    },

    // Additional Private Universities
    {
        name: "Amrita Vishwa Vidyapeetham",
        shortName: "Amrita University",
        code: "AMRITA",
        type: "Private",
        category: "Technical",
        location: "Coimbatore, Tamil Nadu",
        state: "Tamil Nadu",
        city: "Coimbatore",
        establishedYear: 2003,
        affiliation: "Deemed University",
        courses: ["B.Tech", "M.Tech", "MBBS", "MBA", "PhD"],
        branches: ["Computer Science", "Electronics", "Mechanical Engineering", "Medicine", "Management"],
        website: "https://www.amrita.edu",
        status: "active"
    },
    {
        name: "O.P. Jindal Global University",
        shortName: "JGU",
        code: "JGU",
        type: "Private",
        category: "University",
        location: "Sonipat, Haryana",
        state: "Haryana",
        city: "Sonipat",
        establishedYear: 2009,
        affiliation: "Private University",
        courses: ["BA", "MA", "MBA", "Law", "PhD"],
        branches: ["Law", "Business", "International Affairs", "Liberal Arts", "Public Policy"],
        website: "https://www.jgu.edu.in",
        status: "active"
    },
    {
        name: "Ashoka University",
        shortName: "Ashoka",
        code: "ASHOKA",
        type: "Private",
        category: "University",
        location: "Sonipat, Haryana",
        state: "Haryana",
        city: "Sonipat",
        establishedYear: 2014,
        affiliation: "Private University",
        courses: ["BA", "MA", "PhD", "MBA"],
        branches: ["Liberal Arts", "Sciences", "Economics", "Political Science", "Computer Science"],
        website: "https://www.ashoka.edu.in",
        status: "active"
    },
    {
        name: "Bennett University",
        shortName: "Bennett",
        code: "BU",
        type: "Private",
        category: "Technical",
        location: "Greater Noida, Uttar Pradesh",
        state: "Uttar Pradesh",
        city: "Greater Noida",
        establishedYear: 2016,
        affiliation: "Private University",
        courses: ["B.Tech", "MBA", "BBA", "Law", "PhD"],
        branches: ["Computer Science", "Electronics", "Mechanical Engineering", "Management", "Law"],
        website: "https://www.bennett.edu.in",
        status: "active"
    },
    {
        name: "Plaksha University",
        shortName: "Plaksha",
        code: "PLAKSHA",
        type: "Private",
        category: "Technical",
        location: "Mohali, Punjab",
        state: "Punjab",
        city: "Mohali",
        establishedYear: 2021,
        affiliation: "Private University",
        courses: ["B.Tech", "M.Tech", "PhD"],
        branches: ["Computer Science", "Data Science", "Robotics", "Artificial Intelligence"],
        website: "https://www.plaksha.edu.in",
        status: "active"
    },

    // Additional State Universities
    {
        name: "Kerala University",
        shortName: "KU",
        code: "KU",
        type: "Government",
        category: "University",
        location: "Thiruvananthapuram, Kerala",
        state: "Kerala",
        city: "Thiruvananthapuram",
        establishedYear: 1937,
        affiliation: "State University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "B.Com", "M.Com", "PhD"],
        branches: ["Arts", "Sciences", "Commerce", "Law", "Engineering"],
        website: "https://www.keralauniversity.ac.in",
        status: "active"
    },
    {
        name: "Andhra University",
        shortName: "AU",
        code: "AU2",
        type: "Government",
        category: "University",
        location: "Visakhapatnam, Andhra Pradesh",
        state: "Andhra Pradesh",
        city: "Visakhapatnam",
        establishedYear: 1926,
        affiliation: "State University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "B.Tech", "M.Tech", "PhD"],
        branches: ["Arts", "Sciences", "Engineering", "Pharmacy", "Law"],
        website: "https://www.andhrauniversity.edu.in",
        status: "active"
    },
    {
        name: "University of Hyderabad",
        shortName: "UoH",
        code: "UOH",
        type: "Government",
        category: "University",
        location: "Hyderabad, Telangana",
        state: "Telangana",
        city: "Hyderabad",
        establishedYear: 1974,
        affiliation: "Central University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "M.Tech", "PhD"],
        branches: ["Arts", "Sciences", "Social Sciences", "Computer Science", "Biotechnology"],
        website: "https://www.uohyd.ac.in",
        status: "active"
    },
    {
        name: "Guru Nanak Dev University",
        shortName: "GNDU",
        code: "GNDU",
        type: "Government",
        category: "University",
        location: "Amritsar, Punjab",
        state: "Punjab",
        city: "Amritsar",
        establishedYear: 1969,
        affiliation: "State University",
        courses: ["BA", "MA", "B.Sc", "M.Sc", "B.Tech", "MBA", "PhD"],
        branches: ["Arts", "Sciences", "Engineering", "Management", "Agriculture"],
        website: "https://www.gndu.ac.in",
        status: "active"
    },

    // Additional Medical Colleges
    {
        name: "King George's Medical University",
        shortName: "KGMU",
        code: "KGMU",
        type: "Government",
        category: "Medical",
        location: "Lucknow, Uttar Pradesh",
        state: "Uttar Pradesh",
        city: "Lucknow",
        establishedYear: 1905,
        affiliation: "State Medical University",
        courses: ["MBBS", "MD", "MS", "PhD", "B.Sc Nursing"],
        branches: ["Medicine", "Surgery", "Pediatrics", "Gynecology", "Dentistry"],
        website: "https://www.kgmcindia.edu",
        status: "active"
    },
    {
        name: "Maulana Azad Medical College",
        shortName: "MAMC",
        code: "MAMC",
        type: "Government",
        category: "Medical",
        location: "New Delhi, Delhi",
        state: "Delhi",
        city: "New Delhi",
        establishedYear: 1958,
        affiliation: "State Medical College",
        courses: ["MBBS", "MD", "MS"],
        branches: ["Medicine", "Surgery", "Pediatrics", "Gynecology", "Anesthesiology"],
        website: "https://www.mamc.ac.in",
        status: "active"
    },
    {
        name: "Grant Medical College",
        shortName: "GMC Mumbai",
        code: "GMC",
        type: "Government",
        category: "Medical",
        location: "Mumbai, Maharashtra",
        state: "Maharashtra",
        city: "Mumbai",
        establishedYear: 1845,
        affiliation: "State Medical College",
        courses: ["MBBS", "MD", "MS"],
        branches: ["Medicine", "Surgery", "Pediatrics", "Gynecology", "Orthopedics"],
        website: "https://www.gmc.edu",
        status: "active"
    },
    {
        name: "Madras Medical College",
        shortName: "MMC",
        code: "MMC",
        type: "Government",
        category: "Medical",
        location: "Chennai, Tamil Nadu",
        state: "Tamil Nadu",
        city: "Chennai",
        establishedYear: 1835,
        affiliation: "State Medical College",
        courses: ["MBBS", "MD", "MS", "PhD"],
        branches: ["Medicine", "Surgery", "Pediatrics", "Gynecology", "Radiology"],
        website: "https://www.tnmgrmu.ac.in",
        status: "active"
    },

    // Additional Management Institutes
    {
        name: "Indian Institute of Management Lucknow",
        shortName: "IIM Lucknow",
        code: "IIML",
        type: "Government",
        category: "Management",
        location: "Lucknow, Uttar Pradesh",
        state: "Uttar Pradesh",
        city: "Lucknow",
        establishedYear: 1984,
        affiliation: "Institute of National Importance",
        courses: ["MBA", "PhD", "Executive MBA", "Fellow Programme"],
        branches: ["Finance", "Marketing", "Operations", "Strategy", "Entrepreneurship"],
        website: "https://www.iiml.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Management Kozhikode",
        shortName: "IIM Kozhikode",
        code: "IIMK",
        type: "Government",
        category: "Management",
        location: "Kozhikode, Kerala",
        state: "Kerala",
        city: "Kozhikode",
        establishedYear: 1996,
        affiliation: "Institute of National Importance",
        courses: ["MBA", "PhD", "Executive MBA", "Fellow Programme"],
        branches: ["Finance", "Marketing", "Operations", "Strategy", "Public Policy"],
        website: "https://www.iimk.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Management Indore",
        shortName: "IIM Indore",
        code: "IIMI",
        type: "Government",
        category: "Management",
        location: "Indore, Madhya Pradesh",
        state: "Madhya Pradesh",
        city: "Indore",
        establishedYear: 1996,
        affiliation: "Institute of National Importance",
        courses: ["MBA", "PhD", "Executive MBA", "Fellow Programme"],
        branches: ["Finance", "Marketing", "Operations", "Strategy", "Information Systems"],
        website: "https://www.iimidr.ac.in",
        status: "active"
    },
    {
        name: "Indian Institute of Management Shillong",
        shortName: "IIM Shillong",
        code: "IIMS",
        type: "Government",
        category: "Management",
        location: "Shillong, Meghalaya",
        state: "Meghalaya",
        city: "Shillong",
        establishedYear: 2007,
        affiliation: "Institute of National Importance",
        courses: ["MBA", "PhD", "Executive MBA"],
        branches: ["Finance", "Marketing", "Operations", "Strategy", "Human Resources"],
        website: "https://www.iimshillong.ac.in",
        status: "active"
    },

    // Additional Specialized Institutes
    {
        name: "National Institute of Mental Health and Neurosciences",
        shortName: "NIMHANS",
        code: "NIMHANS",
        type: "Government",
        category: "Medical",
        location: "Bangalore, Karnataka",
        state: "Karnataka",
        city: "Bangalore",
        establishedYear: 1954,
        affiliation: "Institute of National Importance",
        courses: ["MBBS", "MD", "PhD", "M.Sc"],
        branches: ["Psychiatry", "Neurology", "Neurosurgery", "Clinical Psychology", "Nursing"],
        website: "https://www.nimhans.ac.in",
        status: "active"
    },
    {
        name: "Postgraduate Institute of Medical Education and Research",
        shortName: "PGIMER",
        code: "PGIMER",
        type: "Government",
        category: "Medical",
        location: "Chandigarh, Chandigarh",
        state: "Chandigarh",
        city: "Chandigarh",
        establishedYear: 1962,
        affiliation: "Institute of National Importance",
        courses: ["MBBS", "MD", "MS", "PhD", "B.Sc Nursing"],
        branches: ["Medicine", "Surgery", "Pediatrics", "Gynecology", "Cardiology"],
        website: "https://www.pgimer.edu.in",
        status: "active"
    },
    {
        name: "Indian Institute of Foreign Trade",
        shortName: "IIFT",
        code: "IIFT",
        type: "Government",
        category: "Management",
        location: "New Delhi, Delhi",
        state: "Delhi",
        city: "New Delhi",
        establishedYear: 1963,
        affiliation: "Deemed University",
        courses: ["MBA", "PhD", "Executive MBA"],
        branches: ["International Business", "Finance", "Marketing", "Operations", "Trade Policy"],
        website: "https://www.iift.edu",
        status: "active"
    },
    {
        name: "Forest Research Institute",
        shortName: "FRI",
        code: "FRI",
        type: "Government",
        category: "Research Institute",
        location: "Dehradun, Uttarakhand",
        state: "Uttarakhand",
        city: "Dehradun",
        establishedYear: 1906,
        affiliation: "Deemed University",
        courses: ["B.Sc", "M.Sc", "PhD"],
        branches: ["Forestry", "Wood Science", "Environmental Science", "Wildlife", "Botany"],
        website: "https://www.icfre.gov.in",
        status: "active"
    },
    {
        name: "Indian Agricultural Research Institute",
        shortName: "IARI",
        code: "IARI",
        type: "Government",
        category: "Research Institute",
        location: "New Delhi, Delhi",
        state: "Delhi",
        city: "New Delhi",
        establishedYear: 1905,
        affiliation: "Deemed University",
        courses: ["B.Sc", "M.Sc", "PhD"],
        branches: ["Agriculture", "Horticulture", "Plant Breeding", "Soil Science", "Agricultural Engineering"],
        website: "https://www.iari.res.in",
        status: "active"
    },

    // Additional Regional Colleges
    {
        name: "Delhi Technological University",
        shortName: "DTU",
        code: "DTU",
        type: "Government",
        category: "Technical",
        location: "New Delhi, Delhi",
        state: "Delhi",
        city: "New Delhi",
        establishedYear: 1941,
        affiliation: "State University",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA"],
        branches: ["Computer Science", "Electronics", "Mechanical Engineering", "Civil Engineering", "Software Engineering"],
        website: "https://www.dtu.ac.in",
        status: "active"
    },
    {
        name: "Netaji Subhas University of Technology",
        shortName: "NSUT",
        code: "NSUT",
        type: "Government",
        category: "Technical",
        location: "New Delhi, Delhi",
        state: "Delhi",
        city: "New Delhi",
        establishedYear: 1983,
        affiliation: "State University",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA"],
        branches: ["Computer Science", "Electronics", "Information Technology", "Mechanical Engineering", "Instrumentation"],
        website: "https://www.nsut.ac.in",
        status: "active"
    },
    {
        name: "Indraprastha Institute of Information Technology Delhi",
        shortName: "IIIT Delhi",
        code: "IIITD",
        type: "Government",
        category: "Technical",
        location: "New Delhi, Delhi",
        state: "Delhi",
        city: "New Delhi",
        establishedYear: 2008,
        affiliation: "State University",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA"],
        branches: ["Computer Science", "Electronics and Communication", "Mathematics and Computing", "Design"],
        website: "https://www.iiitd.ac.in",
        status: "active"
    },
    {
        name: "Punjab Engineering College",
        shortName: "PEC",
        code: "PEC",
        type: "Government",
        category: "Technical",
        location: "Chandigarh, Chandigarh",
        state: "Chandigarh",
        city: "Chandigarh",
        establishedYear: 1921,
        affiliation: "Deemed University",
        courses: ["B.Tech", "M.Tech", "PhD", "MBA"],
        branches: ["Computer Science", "Electronics", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
        website: "https://www.pec.ac.in",
        status: "active"
    }
];

// Function to populate database
const populateAdditionalColleges = async () => {
    try {
        console.log('📝 Inserting additional college data...');

        let insertedCount = 0;
        let skippedCount = 0;

        for (const collegeData of additionalCollegesData) {
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
        console.log(`📝 Total colleges in dataset: ${additionalCollegesData.length}`);

        // Display some statistics
        const totalColleges = await College.countDocuments();
        const byType = await College.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        const byCategory = await College.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        const byState = await College.aggregate([
            { $group: { _id: "$state", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 }
        ]);

        console.log(`\n📈 Updated Database Statistics:`);
        console.log(`📚 Total Colleges in Database: ${totalColleges}`);
        console.log(`\n🏛️  By Type:`);
        byType.forEach(item => {
            console.log(`   ${item._id}: ${item.count}`);
        });
        console.log(`\n🎓 By Category:`);
        byCategory.forEach(item => {
            console.log(`   ${item._id || 'Uncategorized'}: ${item.count}`);
        });
        console.log(`\n🗺️  Top States by College Count:`);
        byState.forEach(item => {
            console.log(`   ${item._id}: ${item.count}`);
        });

    } catch (error) {
        console.error('❌ Error populating colleges:', error);
    }
};

// Main execution function
const main = async () => {
    console.log('🚀 Starting additional college data population...\n');

    await connectDB();
    await populateAdditionalColleges();

    console.log('\n✅ Additional college data population completed!');
    console.log('🔍 You now have a comprehensive database of Indian colleges');
    console.log('📊 The database includes IITs, NITs, IIITs, Central Universities, State Universities,');
    console.log('   Private Universities, Medical Colleges, Management Institutes, and Research Centers');

    process.exit(0);
};

// Run the script
main().catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
});