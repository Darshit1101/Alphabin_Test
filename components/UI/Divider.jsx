export default function Divider({ text = 'Filters & Posts' }) {
  return (
    <div className="flex items-center my-12">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      <span className="px-6 text-gray-500 font-medium">{text}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </div>
  );
}
