import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Terms & Conditions | Kindred School Discovery",
  description: "Read our terms and conditions of use",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="font-serif text-5xl lg:text-6xl font-medium mb-6">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-12">
            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms and Conditions constitute a legally binding agreement made between you and Kindred. By accessing and using this website, you accept and agree to be bound and abide by all of the terms and conditions of this agreement.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Permission is granted to temporarily download one copy of the materials on Kindred for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">3. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials on Kindred's website are provided on an 'as is' basis. Kindred makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">4. Limitations of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall Kindred or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Kindred's website, even if Kindred or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">5. Accuracy of Materials</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials appearing on Kindred's website could include technical, typographical, or photographic errors. Kindred does not warrant that any of the materials on the website are accurate, complete, or current. Kindred may make changes to the materials contained on the website at any time without notice.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">6. Links and Third-Party Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kindred has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Kindred of the site. Use of any such linked website is at the user's own risk.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">7. Modifications to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kindred may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">8. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">9. User Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">You agree that you will not:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Use the website for any illegal or unauthorized purpose</li>
                <li>Harass or cause distress or inconvenience to any person</li>
                <li>Obstruct the flow of dialogue within the website</li>
                <li>Post obscene or vulgar material on the website</li>
                <li>Attempt to gain unauthorized access to the website</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium mb-4">10. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="mt-4 space-y-2 text-muted-foreground">
                <p>Email: legal@kindred.school</p>
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
