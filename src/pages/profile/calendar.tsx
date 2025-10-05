import { useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import dayjs from 'dayjs';

interface DateRangeCalendarProps {
  onDateChange: (dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => void;
}

export default function DateRangeCalendarComponent({ onDateChange }: DateRangeCalendarProps) {
  const [value, setValue] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const handleChange = (newValue: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
    setValue(newValue);
    onDateChange(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangeCalendar', 'DateRangeCalendar']}>
        <DateRangeCalendar disablePast={true} calendars={2} value={value} onChange={handleChange} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
