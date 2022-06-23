import ITSLayout from "@/components/ITSLayout";
import Link from "next/link";

//결함 페이지입니다.
export default function PageNotFoundPage() {
  return (
    <ITSLayout>
      status code: 500 <br />
      서버 에러입니다. 관리자에게 문의하세요.
      <Link href="/">
        <a>Home</a>
      </Link>
    </ITSLayout>
  );
}
