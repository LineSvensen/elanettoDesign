import star from '../public/star.png'

export default function App() {
  return (
    <div className="h-screen flex items-center justify-center bg-red-300">
      <h1 className="text-4xl font-bold text-red-950">
        Why, hello, there!
      </h1>
      <img src={star} alt="star" className="w-20 h-20"></img>
    </div>
  );
}
