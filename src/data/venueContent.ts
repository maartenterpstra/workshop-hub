// Venue information and travel details
export const venueContent = {
  venue: {
    name: "Princess Máxima Center",
    institution: "Auditorium (6th floor), Heidelberglaan 25, 3584 CS Utrecht, The Netherlands",
    routesteps: [
      "At the main entrance of the UMC (that is on floor 1, you don't need any changes w.r.t. floor)",
      "Walk straight ahead following route Q, past the waiting area and shops",
      "Keep following route Q and enter the Q building through the blue doors",
      "Walk straight ahead to the end of the corridor (within the Q building the Auditorium is signposted)",
      "Turn right, and you will find the Auditorium at the end at your left-hand side"
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2866.854073746152!2d5.180305967590564!3d52.089750054035584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c6688f81428091%3A0xfc9989a840c80643!2sPrincess%20M%C3%A1xima%20Center%20for%20Pediatric%20Oncology!5e0!3m2!1sen!2snl!4v1783422701607!5m2!1sen!2snl"
  },

  travel: {
    byTrain: {
      title: "By Train",
      description: "Utrecht is well-connected by train to major Dutch cities. From Utrecht Central Station:",
      instructions: [
        "Take tram line 22 (Uithoflijn) or bus line 28 towards \"Utrecht Science Park\"",
        "Get off at the \"Prinses Máxima Centrum\" (PMC) stop — approximately 15 minutes from Utrecht Centraal"
      ]
    },
    byCar: {
      title: "By Car",
      description: "UMC Utrecht is easily accessible by car from all major highways:",
      instructions: [
        "From A27: Take exit \"Utrecht-Noord/De Uithof\"",
        "Follow signs to \"UMC Utrecht\"",
        "Parking available at P+R De Uithof (paid parking)"
      ]
    },
    byAir: {
      title: "By Air",
      description: "Amsterdam Airport Schiphol is the nearest international airport:",
      instructions: [
        "Direct train from Schiphol to Utrecht CS (approximately 30 minutes)",
        "Trains run every 10-15 minutes",
        "Then follow train directions above"
      ]
    }
  },

  accommodation: {
    title: "Accommodation",
    description: "Utrecht offers a variety of accommodation options. We recommend booking early, especially during the conference dates. Hotels in Utrecht city center are approximately 15-20 minutes from UMC Utrecht by public transport.",
    hotelsNote: "The list below is provided as a convenience for attendees. Booking and payment are the participants' own responsibility; no special rates are negotiated by the organizers.",
    hotels: [
      { name: "Inntel Hotels Utrecht Centre", url: "https://www.inntelhotels.nl/utrechtcentre/en" },
      { name: "Hotel NH Utrecht", url: "https://www.nh-hotels.com/en/hotel/nh-utrecht" },
      { name: "Malie House", url: "https://www.maliehouse.com/en/" },
      { name: "Moxy Utrecht", url: "https://www.marriott.com/en-us/hotels/amsou-moxy-utrecht/overview/" },
      { name: "Park Plaza", url: "https://www.radissonhotels.com/en-us/hotels/park-plaza-utrecht" },
      { name: "Utrecht Boutique Hotels", url: "https://www.utrechtboutiquehotels.nl/en/" },
      { name: "Stayokay Hostel Utrecht Centrum", url: "https://www.stayokay.com/en/hostel/utrecht-centrum" },
      { name: "BUNK Hotel Utrecht Centre", url: "https://wearebunk.com/utrecht/bunk-rooms/" },
    ],
  }
};
