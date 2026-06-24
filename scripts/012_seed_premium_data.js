#!/usr/bin/env node

/**
 * Seed Premium Data for Testing Redesigned School Detail Pages
 * Usage: node scripts/012_seed_premium_data.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://enchwrptwtctikbhrpsg.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const TARGET_SLUG = 'cathedral-and-john-connon-school'

async function seed() {
  try {
    console.log(`📡 Connecting to Supabase at ${supabaseUrl}...`)
    
    // Find target school
    const { data: school, error: findError } = await supabase
      .from('schools')
      .select('id, name')
      .eq('slug', TARGET_SLUG)
      .single()

    if (findError || !school) {
      console.error(`❌ Could not find school with slug "${TARGET_SLUG}":`, findError?.message || 'Not found')
      process.exit(1)
    }

    console.log(`✅ Found school: "${school.name}" (ID: ${school.id})`)

    // 1. Update premium school columns
    console.log('🔄 Updating premium metadata columns...')
    const seatAvailability = {
      "Nursery": "Open",
      "Kindergarten": "Open",
      "Primary (Grades 1-5)": "Limited",
      "Middle School (Grades 6-8)": "Limited",
      "Secondary (Grades 9-10)": "Closed (Waiting List)",
      "Sr. Secondary (Grades 11-12)": "Contact Admissions Desk"
    }

    const admissionProcess = [
      { step: 1, title: "Online Registration Request", description: "Parents submit detailed personal, contact, and academic credentials via our digital portal." },
      { step: 2, title: "Interactive Advisory Interaction", description: "Scheduled meeting between parents, child, and academic counselors to verify eligibility and expectations." },
      { step: 3, title: "Campus Experience Tour", description: "Guided walkthrough of our smart classrooms, specialized science wings, dynamic sport courts, and library hubs." },
      { step: 4, title: "Document Integrity Validation", description: "Verification of official academic records, medical fitness booklets, and residential proofs." },
      { step: 5, title: "Seat Reservation Confirmation", description: "Formal seat offer letter issued upon verification, followed by standard registration fee payment." },
      { step: 6, title: "Term Onboarding", description: "Student receives orientation materials, uniform parameters, transport routes, and calendar of events." }
    ]

    const documentsRequired = [
      "Copy of Student's Birth Certificate (attested by Municipal authority)",
      "6 recent passport-size color photographs of the student",
      "3 recent passport-size photos of both parents",
      "Previous school's transfer certificate (TC) and final report card transcript",
      "Proof of residence (Electricity bill, Aadhar card, or Passport copy)",
      "Official immunization booklet and physical fitness report from a registered physician"
    ]

    const highlightsStructured = [
      { title: "Elite Heritage", description: "Founded in 1860, offering a legacy of producing global leaders and change-makers.", icon: "Award" },
      { title: "World-Class Infrastructure", description: "Equipped with state-of-the-art physics, chemistry, biology, and robotics laboratories.", icon: "Shield" },
      { title: "Rigorous ICSE/IB Curricula", description: "Dual curriculum choice offering deep foundations and international pathways.", icon: "GraduationCap" },
      { title: "Holistic Arts & Sports", description: "Professional coaches and dedicated arenas for tennis, basketball, performing arts, and debating clubs.", icon: "Sparkles" },
      { title: "Empowered Faculty", description: "Highly trained educators with regular certifications in active teaching methodologies.", icon: "Users" },
      { title: "Secure Modern Campus", description: "CCTV monitoring, GPS-tracked student transport fleet, and fully gated access control.", icon: "BookOpen" }
    ]

    const scholarships = [
      { title: "Founder's Merit Award", description: "Waiver of up to 75% on annual tuition fees for students securing above 95% in board examinations." },
      { title: "Outstanding Sports Honor", description: "Flat 25% concession on tuition fees for students representing the state or nation in inter-school tournaments." },
      { title: "Alumni Sibling Scholarship", description: "Flat 10% support waiver for younger siblings of active/alumni students studying concurrently." }
    ]

    const withdrawalPolicy = "Written application for withdrawal must be submitted to the Admissions Registrar at least 30 working days before the start of the next academic term. Registration, admission, and facility setup components are non-refundable. Security deposits are processed for full refund within 45 days of official withdrawal, subject to clearance certificates from labs, library, and finance departments. No term fees will be refunded once the term classes have officially commenced."

    const awards = [
      { title: "Ranked #1 Day School in India", year: "2025", details: "Awarded by EducationWorld National School Rankings for academic and infrastructure standards." },
      { title: "National Digital Integration Trophy", year: "2024", details: "Recognized for modern smart classrooms and integrated remote-learning portals." },
      { title: "STEM Excellence Certificate", year: "2024", details: "Awarded for exceptional achievements in inter-school science and robotic olympiads." }
    ]

    const { error: updateError } = await supabase
      .from('schools')
      .update({
        seat_availability: seatAvailability,
        admission_process: admissionProcess,
        documents_required: documentsRequired,
        highlights_structured: highlightsStructured,
        scholarships: scholarships,
        withdrawal_policy: withdrawalPolicy,
        awards: awards
      })
      .eq('id', school.id)

    if (updateError) {
      console.error('❌ Failed to update school columns:', updateError.message)
      console.warn('💡 Have you run the SQL migration (scripts/011_add_premium_school_fields.sql) in the Supabase SQL editor yet?')
      process.exit(1)
    }
    console.log('✅ School metadata columns updated successfully!')

    // 2. Clear & Seed School Fees
    console.log('🔄 Seeding school fees details...')
    await supabase.from('school_fees').delete().eq('school_id', school.id)
    const feeRows = [
      { school_id: school.id, level: "Nursery & Kindergarten", tuition_fee: "₹1,80,000", registration_fee: "₹15,000", development_fee: "₹20,000", transport_fee: "₹25,000", meal_fee: "₹18,000", total_fee: "₹2,58,000", notes: "Tuition and meal fees are paid semi-annually." },
      { school_id: school.id, level: "Primary (Grades 1-5)", tuition_fee: "₹2,20,000", registration_fee: "₹15,000", development_fee: "₹25,000", transport_fee: "₹30,000", meal_fee: "₹20,000", total_fee: "₹3,10,000", notes: "Development fee is charged once per academic year." },
      { school_id: school.id, level: "Middle School (Grades 6-8)", tuition_fee: "₹2,50,000", registration_fee: "₹15,000", development_fee: "₹30,000", transport_fee: "₹30,000", meal_fee: "₹22,000", total_fee: "₹3,47,000", notes: "Science lab consumables fees are included in the tuition fee." },
      { school_id: school.id, level: "Secondary (Grades 9-10)", tuition_fee: "₹2,80,000", registration_fee: "₹15,000", development_fee: "₹35,000", transport_fee: "₹32,000", meal_fee: "Optional", total_fee: "₹3,62,000", notes: "Board registration and examination charges are billed separately." },
      { school_id: school.id, level: "Sr. Secondary (Grades 11-12)", tuition_fee: "₹3,40,000", registration_fee: "₹15,000", development_fee: "₹40,000", transport_fee: "₹32,000", meal_fee: "Optional", total_fee: "₹4,27,000", notes: "Lab fees for Physics, Chemistry, Biology, or Computer Science are included." }
    ]
    const { error: feeError } = await supabase.from('school_fees').insert(feeRows)
    if (feeError) console.error('❌ Error seeding fees:', feeError.message)
    else console.log('✅ Fees seeded successfully!')

    // 3. Clear & Seed Gallery
    console.log('🔄 Seeding school gallery photos...')
    await supabase.from('school_gallery').delete().eq('school_id', school.id)
    const galleryRows = [
      { school_id: school.id, image_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800", caption: "Smart Classroom with Interactive Displays", category: "Classroom" },
      { school_id: school.id, image_url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800", caption: "State-of-the-Art Chemistry Lab", category: "Labs" },
      { school_id: school.id, image_url: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800", caption: "Central Heritage Courtyard & Play Area", category: "Campus" },
      { school_id: school.id, image_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800", caption: "Basketball Championship Tournament", category: "Sports" },
      { school_id: school.id, image_url: "https://images.unsplash.com/photo-1503676993299-9cd2063a830d?auto=format&fit=crop&q=80&w=800", caption: "Modern Library & Collaborative Space", category: "Campus" }
    ]
    let { error: galleryError } = await supabase.from('school_gallery').insert(galleryRows)
    if (galleryError) {
      if (galleryError.message.includes('category') || (galleryError.details && galleryError.details.includes('category'))) {
        console.log('⚠️  Category column not found in school_gallery schema cache. Retrying insert without category field...')
        const cleanRows = galleryRows.map(({ category, ...rest }) => rest)
        const { error: retryError } = await supabase.from('school_gallery').insert(cleanRows)
        if (retryError) {
          console.error('❌ Error seeding gallery (retry):', retryError.message)
        } else {
          console.log('✅ Gallery seeded successfully (without category)!')
        }
      } else {
        console.error('❌ Error seeding gallery:', galleryError.message)
      }
    } else {
      console.log('✅ Gallery seeded successfully!')
    }

    // 4. Clear & Seed FAQs
    console.log('🔄 Seeding school FAQs...')
    await supabase.from('school_faqs').delete().eq('school_id', school.id)
    const faqRows = [
      { school_id: school.id, question: "What is the average class size?", answer: "We restrict class strength to a maximum of 25 students in pre-primary and 30 students in primary and senior sections to ensure interactive learning." },
      { school_id: school.id, question: "Which boards are offered at the secondary level?", answer: "We offer the ICSE pathway in secondary classes, and a choice between ISC (National) and IB Diploma (International) in Senior Secondary grades." },
      { school_id: school.id, question: "Is school transport available for all areas?", answer: "Yes, our air-conditioned buses cover major routes throughout the metropolitan area. All vehicles include active GPS tracking, speed governors, and female escorts." },
      { school_id: school.id, question: "Do you offer sports coaching after school hours?", answer: "Yes, we have specialized sports academies running on campus from 3:30 PM to 5:30 PM for swimming, basketball, football, and lawn tennis." }
    ]
    const { error: faqError } = await supabase.from('school_faqs').insert(faqRows)
    if (faqError) console.error('❌ Error seeding FAQs:', faqError.message)
    else console.log('✅ FAQs seeded successfully!')

    // 5. Clear & Seed Admissions
    console.log('🔄 Seeding school admissions schedule...')
    await supabase.from('school_admissions').delete().eq('school_id', school.id)
    const admissionRows = [
      { school_id: school.id, title: "Nursery & KG Registration Open", description: "Registration window is now open for pre-primary applicants. Apply before slots are exhausted.", deadline: "July 31, 2026", url: "#" },
      { school_id: school.id, title: "Grade 11 IB Diploma Admissions", description: "Applications are being accepted for science, commerce, and humanities streams for the IB diploma pathway.", deadline: "August 15, 2026", url: "#" }
    ]
    const { error: admissionError } = await supabase.from('school_admissions').insert(admissionRows)
    if (admissionError) console.error('❌ Error seeding admissions:', admissionError.message)
    else console.log('✅ Admissions seeded successfully!')

    // 6. Clear & Seed Reviews
    console.log('🔄 Seeding sample parent reviews...')
    await supabase.from('school_reviews').delete().eq('school_id', school.id)
    const reviewRows = [
      { school_id: school.id, author: "Rajesh Malhotra", rating: 5.0, title: "Legacy of Excellence", body: "Extremely pleased with the academic rigour and focus on extracurriculars. My daughter has grown into a confident public speaker and critical thinker." },
      { school_id: school.id, author: "Sunita Deshmukh", rating: 4.0, title: "Exceptional Infrastructure & Teachers", body: "The library and laboratories are outstanding. Teachers take individual care. The fee structure is premium, but the quality of education justifies it." },
      { school_id: school.id, author: "Arjun Sen", rating: 5.0, title: "Perfect Balance of Sports & Studies", body: "The coaches are excellent. My son is in the football team and gets full academic support to catch up when away for games." }
    ]
    const { error: reviewError } = await supabase.from('school_reviews').insert(reviewRows)
    if (reviewError) console.error('❌ Error seeding reviews:', reviewError.message)
    else console.log('✅ Reviews seeded successfully!')

    console.log('\n🌟 Seeding complete! Cathedral and John Connon School is now a fully configured premium showcase school. 🌟')

  } catch (error) {
    console.error('❌ Seeding execution failed:', error.message)
  }
}

seed()
