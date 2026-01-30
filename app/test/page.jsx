export default function TestPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>If you can see this, the page is working.</p>
      <a href="/requests/new" className="text-blue-600 hover:underline">
        Go to Create Request
      </a>
    </div>
  );
}
