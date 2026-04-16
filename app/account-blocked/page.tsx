import Link from "next/link";
import { ShieldAlert, Mail, Phone, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Account Suspended | Reward Banking",
};

export default function AccountBlockedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <ShieldAlert size={38} className="text-red-500" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-24 font-semibold text-gray-900">Account Suspended</h1>
          <p className="mt-2 text-14 leading-relaxed text-gray-500">
            Your account has been temporarily suspended. This may be due to a
            security review, policy violation, or an action taken by our compliance
            team. No transactions can be made while your account is suspended.
          </p>
        </div>

        {/* What you can do */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-15 font-semibold text-gray-800">What to do next</h2>
          <ul className="flex flex-col gap-3 text-14 text-gray-600">
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-11 font-semibold text-gray-700">1</span>
              Check your registered email inbox for a message from our support team with more details.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-11 font-semibold text-gray-700">2</span>
              Reach out to support using the contact options below. Have your account email ready.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-11 font-semibold text-gray-700">3</span>
              Once our team reviews your case, access will be restored or further instructions provided.
            </li>
          </ul>
        </div>

        {/* Contact options */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href="mailto:support@rewardbanking.com"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 text-left hover:border-gray-300 hover:bg-gray-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
              <Mail size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-13 font-medium text-gray-800">Email Support</p>
              <p className="text-12 text-gray-500">support@rewardbanking.com</p>
            </div>
          </a>

          <a
            href="tel:+18005550199"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 text-left hover:border-gray-300 hover:bg-gray-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50">
              <Phone size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-13 font-medium text-gray-800">Phone Support</p>
              <p className="text-12 text-gray-500">1-800-555-0199</p>
            </div>
          </a>
        </div>

        {/* Back to sign-in */}
        <div className="text-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 text-13 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={13} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
