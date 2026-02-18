import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Privacy Policy | Kindred School Discovery",
  description: "Read our privacy policy to understand how we protect your data",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="font-serif text-5xl lg:text-6xl font-medium mb-6">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 prose prose-invert max-w-none">
          <div className="space-y-12">
            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kindred ("we", "us", "our") operates the Kindred platform. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">2. Information Collection and Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect several different types of information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Personal Data:</strong> Name, email address, phone number, school preferences</li>
                <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time and date of visit</li>
                <li><strong>Cookie Data:</strong> Information from cookies and similar tracking technologies</li>
                <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">3. Use of Data</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Kindred uses the collected data for various purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>To provide and maintain the Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To allow you to participate in interactive features</li>
                <li>To provide customer support and respond to inquiries</li>
                <li>To gather analysis or valuable information to improve the Service</li>
                <li>To monitor the usage of the Service</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">4. Security of Data</h2>
              <p className="text-muted-foreground leading-relaxed">
                The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">5. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies to enhance your user experience. Cookies are small files of letters and numbers that we store on your browser or the hard drive of your computer. You can configure your browser to reject cookies, though some features of our Service may no longer function properly.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">6. Third Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service may contain links to third-party sites that are not operated by us. This Privacy Policy does not apply to third-party websites, and we are not responsible for their privacy practices.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">7. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information and terminate the child's account.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">8. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">9. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 space-y-2 text-muted-foreground">
                <p>Email: privacy@kindred.school</p>
                <p>Address: 123 Education Boulevard, New Delhi, India 110001</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
