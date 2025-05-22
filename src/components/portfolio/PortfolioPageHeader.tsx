
import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioPageHeaderProps {
  loading: boolean;
  error: string | null;
}

const PortfolioPageHeader = ({ loading, error }: PortfolioPageHeaderProps) => {
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center items-center">
          <Skeleton className="h-[400px] w-full max-w-3xl" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-12 w-32 mx-2" />
          <Skeleton className="h-12 w-32 mx-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">خطأ في تحميل الملف</h2>
        <p className="mt-2 text-gray-600">{error}</p>
      </div>
    );
  }

  return null;
};

export default PortfolioPageHeader;
