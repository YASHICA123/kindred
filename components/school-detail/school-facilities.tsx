"use client"

import { BookOpen, Laptop, FlaskConical, Trophy, Bus, HeartPulse, Video, Music, Compass, LayoutGrid } from "lucide-react"
import { SchoolDetailData } from "./types"

interface SchoolFacilitiesProps {
  school: SchoolDetailData
}

export default function SchoolFacilities({ school }: SchoolFacilitiesProps) {
  
  const dbFacilities = school.facilities || []
  
  const getIconForFacility = (name: string) => {
    const lname = name.toLowerCase()
    if (lname.includes("class") || lname.includes("room")) return <LayoutGrid className="w-[21px] h-[21px] text-primary" />
    if (lname.includes("lib") || lname.includes("book")) return <BookOpen className="w-[21px] h-[21px] text-primary" />
    if (lname.includes("lab") || lname.includes("science")) return <FlaskConical className="w-[21px] h-[21px] text-primary" />
    if (lname.includes("comp") || lname.includes("pc")) return <Laptop className="w-[21px] h-[21px] text-primary" />
    if (lname.includes("sport") || lname.includes("ground") || lname.includes("play")) return <Compass className="w-[21px] h-[21px] text-primary" />
    if (lname.includes("trans") || lname.includes("bus")) return <Bus className="w-[21px] h-[21px] text-primary" />
    if (lname.includes("medic") || lname.includes("health") || lname.includes("clinic")) return <HeartPulse className="w-[21px] h-[21px] text-primary" />
    if (lname.includes("cctv") || lname.includes("secur") || lname.includes("camera")) return <Video className="w-[21px] h-[21px] text-primary" />
    if (lname.includes("music") || lname.includes("dance") || lname.includes("art")) return <Music className="w-[21px] h-[21px] text-primary" />
    return <Trophy className="w-[21px] h-[21px] text-primary" />
  }

  const facilitiesToRender = dbFacilities.map(f => ({ name: f, icon: getIconForFacility(f) }))
  const awardsList: any[] = school.awards && school.awards.length > 0 ? school.awards : []

  return (
    <div className="space-y-5">
      
      {/* FACILITIES SECTION */}
      <section 
        id="facilities" 
        className="scroll-mt-[120px]"
        style={{
          background: "#fff",
          border: "1px solid #e9edf3",
          borderRadius: "16px",
          padding: "26px 28px",
          boxShadow: "0 1px 2px rgba(15,27,51,.05),0 10px 26px -16px rgba(15,27,51,.1)"
        }}
      >
        <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "4px" }}>
          Campus &amp; facilities
        </div>
        <h2 style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 18px", color: "#0f1b33" }}>
          Facilities
        </h2>
        
        {facilitiesToRender.length > 0 ? (
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px"
            }}
          >
            {facilitiesToRender.map((fac, idx) => (
              <div 
                key={idx} 
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "9px",
                  border: "1px solid #eef1f5",
                  borderRadius: "13px",
                  padding: "18px 12px"
                }}
              >
                <span 
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: "rgba(0, 82, 204, 0.08)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {fac.icon}
                </span>
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f1b33" }}>
                  {fac.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ border: "1px solid #eef1f5", borderRadius: "12px", padding: "26px 20px", textAlign: "center", fontSize: "14.5px", color: "#6c7a92", fontWeight: 500 }}>
            Facilities list has not been registered yet.
          </div>
        )}
      </section>

      {/* RECOGNITION / AWARDS SECTION */}
      {awardsList.length > 0 && (
        <section 
          className="scroll-mt-[120px]"
          style={{
            background: "#fff",
            border: "1px solid #e9edf3",
            borderRadius: "16px",
            padding: "26px 28px",
            boxShadow: "0 1px 2px rgba(15,27,51,.05),0 10px 26px -16px rgba(15,27,51,.1)"
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "4px" }}>
            Recognition
          </div>
          <h2 style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 18px", color: "#0f1b33" }}>
            Awards &amp; recognition
          </h2>
          
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(228px, 1fr))",
              gap: "14px"
            }}
          >
            {awardsList.map((aw, i) => (
              <div 
                key={i} 
                style={{
                  border: "1px solid #f0e6c8",
                  borderRadius: "13px",
                  padding: "18px",
                  background: "linear-gradient(180deg,#fffdf6,#fff)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "22px" }}>{aw.emoji || "🏆"}</span>
                  <span 
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#a17d1a",
                      background: "#fbf3d8",
                      padding: "4px 10px",
                      borderRadius: "999px"
                    }}
                  >
                    {aw.year}
                  </span>
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "3px", color: "#0f1b33" }}>
                  {aw.title}
                </div>
                <div style={{ fontSize: "13px", color: "#6c7a92", lineHeight: 1.5 }}>
                  {aw.details || aw.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
