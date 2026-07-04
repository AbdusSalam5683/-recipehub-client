// client/src/app/layout.jsx
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ResponsiveToaster from '../components/common/ResponsiveToaster';


export const metadata = {
  title: 'RecipeHub - Share & Discover Amazing Recipes',
  description: 'RecipeHub is a platform where food enthusiasts can create, share, discover, and manage recipes.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFBF5' },
    { media: '(prefers-color-scheme: dark)', color: '#241812' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      <body className="overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <div className="min-h-screen w-full flex flex-col bg-cream-50 dark:bg-charcoal-900 transition-colors duration-300">
              <Navbar />
              
              <main className="flex-grow w-full">{children}</main>
              <Footer />
            </div>
            <ResponsiveToaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
