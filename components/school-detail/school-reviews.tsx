"use client"

interface ReviewItem {
  id: number
  author?: string
  rating?: number
  title?: string
  body?: string
  createdAt?: string
}

interface SchoolReviewsProps {
  reviewsList: ReviewItem[]
  averageRating: string
  totalReviewsCount: number
  onOpenReviewModal: () => void
}

export default function SchoolReviews({
  reviewsList,
  averageRating,
  totalReviewsCount,
  onOpenReviewModal
}: SchoolReviewsProps) {
  
  const localReviews = reviewsList || []

  // Helper to generate initials
  const getInitials = (name: string) => {
    if (!name) return "P"
    return name
      .trim()
      .split(/\s+/)
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || "P"
  }

  // Pre-calculated stats for the rating distribution bars (default if no reviews)
  const fiveStarPct = localReviews.length > 0 ? Math.round((localReviews.filter(r => (r.rating || 5) >= 4.5).length / localReviews.length) * 100) : 0
  const fourStarPct = localReviews.length > 0 ? Math.round((localReviews.filter(r => (r.rating || 5) >= 3.5 && (r.rating || 5) < 4.5).length / localReviews.length) * 100) : 0
  const threeStarPct = localReviews.length > 0 ? Math.round((localReviews.filter(r => (r.rating || 5) >= 2.5 && (r.rating || 5) < 3.5).length / localReviews.length) * 100) : 0
  const lowStarPct = localReviews.length > 0 ? Math.round((localReviews.filter(r => (r.rating || 5) < 2.5).length / localReviews.length) * 100) : 0

  // Avatar backgrounds
  const avatarColors = ["#0052CC", "#3B82F6", "#0c8b51", "#c2410c", "#5b6b86"]

  return (
    <section 
      id="reviews" 
      className="scroll-mt-[120px]"
      style={{
        background: "#fff",
        border: "1px solid #e9edf3",
        borderRadius: "16px",
        padding: "26px 28px",
        boxShadow: "0 1px 2px rgba(15,27,51,.05),0 10px 26px -16px rgba(15,27,51,.1)"
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px", marginBottom: "18px" }}>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "4px" }}>
            Parent &amp; student voices
          </div>
          <h2 style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-.02em", margin: 0, color: "#0f1b33" }}>
            Reviews
          </h2>
        </div>
        <button 
          onClick={onOpenReviewModal}
          style={{
            background: "rgba(0, 82, 204, 0.08)",
            color: "var(--primary)",
            border: 0,
            padding: "11px 18px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "background 0.2s"
          }}
        >
          ＋ Share your experience
        </button>
      </div>

      {/* Stats Block */}
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          gap: "22px",
          flexWrap: "wrap",
          background: "#f7f9fc",
          border: "1px solid #eef1f5",
          borderRadius: "13px",
          padding: "18px 22px",
          marginBottom: "16px"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1, color: "#0f1b33" }}>
            {averageRating}
          </div>
          <div style={{ color: "#f5a623", fontSize: "15px", marginTop: "4px" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < Math.round(Number(averageRating)) ? "★" : "☆"}</span>
            ))}
          </div>
          <div style={{ fontSize: "12px", color: "#8a96aa", marginTop: "3px", fontWeight: 600 }}>
            {totalReviewsCount || 0} reviews
          </div>
        </div>

        <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#8a96aa", fontWeight: 600 }}>
            <span style={{ width: "28px" }}>5★</span>
            <div style={{ flex: 1, height: "7px", background: "#e8edf5", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ width: `${fiveStarPct}%`, height: "100%", background: "#0c8b51" }}></div>
            </div>
            <span>{fiveStarPct}%</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#8a96aa", fontWeight: 600 }}>
            <span style={{ width: "28px" }}>4★</span>
            <div style={{ flex: 1, height: "7px", background: "#e8edf5", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ width: `${fourStarPct}%`, height: "100%", background: "#0c8b51" }}></div>
            </div>
            <span>{fourStarPct}%</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#8a96aa", fontWeight: 600 }}>
            <span style={{ width: "28px" }}>3★</span>
            <div style={{ flex: 1, height: "7px", background: "#e8edf5", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ width: `${threeStarPct}%`, height: "100%", background: "#f5a623" }}></div>
            </div>
            <span>{threeStarPct}%</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#8a96aa", fontWeight: 600 }}>
            <span style={{ width: "28px" }}>1-2★</span>
            <div style={{ flex: 1, height: "7px", background: "#e8edf5", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ width: `${lowStarPct}%`, height: "100%", background: "#EF4444" }}></div>
            </div>
            <span>{lowStarPct}%</span>
          </div>
        </div>
      </div>

      {/* Testimonials List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "14px" }}>
        {localReviews.length > 0 ? (
          localReviews.map((rev, index) => {
            const author = rev.author || "Anonymous"
            const initials = getInitials(author)
            const rating = rev.rating || 5
            const avatarBg = avatarColors[index % avatarColors.length]
            
            return (
              <div 
                key={rev.id || index} 
                style={{
                  border: "1px solid #eef1f5",
                  borderRadius: "13px",
                  padding: "18px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "10px" }}>
                  <span 
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      background: avatarBg,
                      color: "#fff",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px"
                    }}
                  >
                    {initials}
                  </span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f1b33" }}>{author}</div>
                    <div style={{ fontSize: "12px", color: "#8a96aa", fontWeight: 600 }}>
                      Parent {rev.title ? `· ${rev.title}` : ""}
                    </div>
                  </div>
                </div>
                <div style={{ color: "#f5a623", fontSize: "14px", marginBottom: "7px" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < rating ? "★" : "☆"}</span>
                  ))}
                </div>
                <div style={{ fontSize: "14px", color: "#3a4a66", lineHeight: 1.55 }}>
                  "{rev.body || ""}"
                </div>
              </div>
            )
          })
        ) : (
          <div 
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px 20px",
              color: "#8a96aa",
              fontSize: "14.5px",
              fontWeight: 500
            }}
          >
            No reviews yet. Be the first to share your experience!
          </div>
        )}
      </div>

    </section>
  )
}
