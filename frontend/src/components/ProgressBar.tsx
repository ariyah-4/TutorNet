interface ProgressBarProps {
    progress: number; // Percentage 0-100
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Progress</span>
                <span className="text-sm font-bold text-blue-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-700 ease-in-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;