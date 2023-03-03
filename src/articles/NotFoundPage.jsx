import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <h1>
      Страница не найдена, вернуться <Link to="/"> домой</Link>
    </h1>
  );
};

export { NotFoundPage };
