export default function StatsCard({ label, value, delta, colorClass = 'bg-white' }) {
    return (
        <div className={`${colorClass} p-4 h-24 rounded shadow flex justify-between items-center`}>
            {/* Add vertical spacing between label & value */}
            <div className="space-y-0.5">
                <p className="text-gray-500">{label}</p>
                <p className="font-bold text-lg md:text-2xl">{value}</p>
            </div>
            {delta && (
                <span className="text-[0.7rem] font-medium bg-white/30 rounded-full px-2 py-0.5">
                    {delta}
                </span>
            )}
        </div>
    );
}