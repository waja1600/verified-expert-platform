
interface PortfolioErrorStateProps {
  message?: string;
}

const PortfolioErrorState = ({ message = "لم يتم العثور على الخبير" }: PortfolioErrorStateProps) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold">{message}</h2>
    </div>
  );
};

export default PortfolioErrorState;
