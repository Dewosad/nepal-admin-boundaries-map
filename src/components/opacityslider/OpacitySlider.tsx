import React from 'react';

interface OpacityLegendProps {
    title: string;
    value: number;
    handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
    customStyle?: object;

}

const OpacitySlider = ({ title, value, handler, customStyle = {} }: OpacityLegendProps) => (
    <div
    className='flex flex-col items-end'
        style={customStyle}
    >
        {
            title && (
                <p className='text-white z-201 opacity-100 '>
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
            className='z-201 appearance-none w-[185px] h-[6px] bg-gray-300 outline-none rounded-[4px] opacity-90 transition-opacity duration-200 cursor-pointer'
        />
    </div>
);

export default OpacitySlider;
