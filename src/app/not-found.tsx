import Link from "next/link";
import { t } from "@/lib/i18n";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase">
          {t("errors.notFoundCategory")}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          {t("errors.notFoundTitle")}
        </h1>
        <p className="mt-3 text-neutral-600">{t("errors.notFoundBody")}</p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
          >
            {t("errors.returnHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
