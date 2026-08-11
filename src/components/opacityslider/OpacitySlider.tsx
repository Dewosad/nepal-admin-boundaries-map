import type { ChangeEvent } from 'react';

interface OpacityLegendProps {
    title: string;
    value: number;
    handler: (e: ChangeEvent<HTMLInputElement>) => void;
    customStyle?: object;

}

const OpacitySlider = ({ title, value, handler, customStyle = {} }: OpacityLegendProps) => (
    <div
    className='flex flex-col gap-2'
        style={customStyle}
    >
        {
            title && (
                <p className='text-xs font-medium text-slate-500'>
                    {title}
                </p>
            )
        }
        <input
            onChange={handler}
            id="slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={value}
            className='appearance-none w-full h-1.5 bg-slate-200 outline-none rounded-full opacity-90 transition-opacity duration-200 cursor-pointer accent-slate-900'
        />
    </div>
);

export default OpacitySlider;
