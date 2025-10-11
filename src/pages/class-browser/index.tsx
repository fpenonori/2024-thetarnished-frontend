import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Content, Card, Title, Instructor, BrowserWrapper, CardInfo, ButtonsContainer, StaticSkeletonCard, Select, InputsContainer, PaymentButton, CashFlowProLogo, CloseButton, LeftContainer, SlotButton, RightContainer, SummaryContainer, TimeInput } from './components';
import { Button } from '../../components/main-button/components';
import { useAuth } from '../../auth/useAuth';
import { Message } from '../../components/message/components';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import Logo from '../../components/top-down-logo';
import { PopUp, PopUpContainer } from '../../components/payment-popup/components';
import Topbar from '../../components/topbar';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import CashFlowLogo from '../../assets/Cash Flow Logo.jpeg';
import { RiCloseLargeFill } from "react-icons/ri";
import { GoPlus, GoDash  } from "react-icons/go";
import { InteractionBlocker } from '../../components/interaction-blocker/components';

interface Teacher {
    teacherid: string;
    firstname: string;
    lastname: string;
    email: string;
    subjectid: string;
}

interface Schedule {
    scheduleid: string;
    start_time: string;
    end_time: string;
    teacherid: string;
    dayofweek: string;
    dayofmonth: string;
    Teacher: Teacher;
    maxstudents: number;
}

interface Subject {
  subjectid: number;
  subjectname: string;
}

interface FilterState {
  teacherName: string;
  weekdays: string[];
  subject: string;
  individual: boolean | null;
  timeRanges: { from: string; to: string };
}

const ClassBrowser = () => {
    const [teachersDictatingSubject, setTeachersDictatingSubject] = useState<{ teacher: Teacher; schedule: Schedule[] }[]>([]);
    const [teacherSchedule, setTeacherSchedule] = useState<Schedule[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<{ day: string, time: string }[]>([{ day: '', time: '' }]);
    const [clickedClass, setClickedClass] = useState<Teacher | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const [isBookingTimeout, setIsBookingTimeout] = useState(false);
    const [searchQuery] = useState('');
    const [isBookingWithCashFlow, setIsBookingWithCashFlow] = useState(false);
    const [prevTeachersDictatingSubject, setPrevTeachersDictatingSubject] = useState<{ teacher: Teacher; schedule: Schedule[] }[]>([]);


    // loading states
    const [loadingFetchTeachers, setLoadingFetchTeachers] = useState(true);
    const [loadingFetchPreviousTeachers, setLoadingFetchPreviousTeachers] = useState(true);
    const [loadingFetchSubjects, setLoadingFetchSubject] = useState(true);
    const [loadingApplyFilter, setLoadingApplyFilter] = useState(false);

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const { subjectid: subjectId } = subjects?.length ? subjects[0] : {subjectid: '' };
    const { user } = useAuth();
    const URL = import.meta.env.VITE_API_URL;
    const INITIAL_FILTER_STATE = {
      teacherName: "",
      weekdays: [],
      subject: "",
      individual: true,
      timeRanges: { from: "08:00", to: "21:00" },
    }
    
        const [filter, setFilter] = useState<FilterState>(INITIAL_FILTER_STATE);


        const getPrevTeachersDictatingSubject = async () => {
          console.log('getPrevTeachers');
            if (user?.id) {
                try {

                    const params = new URLSearchParams();
                    if (filter.subject) {
                      params.append("subjectid", filter.subject);
                    }

                    const queryString = params.toString();

                    setLoadingFetchPreviousTeachers(true)

                    const requestPath = `${URL}students/get-previous/${user?.id}?${queryString}`
                    console.log('requestPath', requestPath)
                    const response = await fetch(requestPath, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user?.token}`,
                        },
                    });
                    const teachers = await response.json();

                    console.log('teachers', teachers);

                    const schedules = await Promise.all(
                        teachers.map(async (teacher: Teacher) => {
                            const scheduleResponse = await fetch(`${URL}classes/get-monthly-schedule-by/${teacher.teacherid}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${user?.token}`,
                                },
                            });
                            const teacherSchedule = await scheduleResponse.json();
                            return { teacher, schedule: teacherSchedule };
                        })
                    );
                    const filteredSchedules = schedules.filter(({ schedule }) => schedule.length > 0);

                    console.log('filteredSchedules', filteredSchedules);

                    setPrevTeachersDictatingSubject(filteredSchedules);
                    setLoadingFetchPreviousTeachers(false);
                    
                } catch (error) {
                    console.error('Error fetching teachers dictating subjects:', error);
                    setLoadingFetchPreviousTeachers(false);
                }
            }
        };
    const applyFilter = async () => {

      // parse filters to query params
      const params = new URLSearchParams();

      if (filter.teacherName) {
        params.append("name", filter.teacherName);
      }

      if (filter.subject) {
        params.append("subjectid", filter.subject);
      }

      if (filter.weekdays.length > 0) {
        // Convert weekday names to numbers (0 for Sunday, 1 for Monday, etc.)
        const weekdayNumbers = filter.weekdays.map(day => {
          switch(day) {
            case 'sun': return '7';
            case 'mon': return '1';
            case 'tue': return '2';
            case 'wed': return '3';
            case 'thu': return '4';
            case 'fri': return '5';
            case 'sat': return '6';
            default: return '';
          }
        }).filter(num => num !== '').join(',');
        params.append("weekday", weekdayNumbers);
      }

      if (filter.timeRanges) {
        if (filter.timeRanges.from) {
          params.append("from", filter.timeRanges.from);
        }
        if (filter.timeRanges.to) {
          params.append("to", filter.timeRanges.to);
        }
      }

      if (filter.individual !== null) {
      }  params.append("individual", filter.individual ? "true" : "false");

      const queryString = params.toString();

      setLoadingApplyFilter(true);
        try {
          const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user?.token}`,
            },
          };
          const response = await fetch(`${URL}teachers?${queryString}`, options);
          const teachers = await response.json();

          const schedules = await Promise.all(
            teachers.map(async (teacher: Teacher) => {
              const scheduleResponse = await fetch(`${URL}classes/get-monthly-schedule-by/${teacher.teacherid}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user?.token}`,
                },
              });
              const teacherSchedule = await scheduleResponse.json();
              return { teacher, schedule: teacherSchedule };
            })
          );
          const filteredSchedules = schedules.filter(({ schedule }) => schedule.length > 0);

          await getPrevTeachersDictatingSubject()
          setTeachersDictatingSubject(filteredSchedules);

      setLoadingApplyFilter(false);
        } catch (error) {
          console.error('Error fetching filtered teachers:', error);

      setLoadingApplyFilter(false);
        }


    };

    const clearFilter = () => {
      setFilter(INITIAL_FILTER_STATE);
      applyFilter();
    }




    useEffect(() => {
        const getTeachersDictatingSubject = async () => {
                try {
                    setLoadingFetchTeachers(true)
                    const options = {
                      method: 'GET',
                      headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user?.token}`,
                      },
                    };
                    const params = {};
                    const query = new URLSearchParams(params);
                    const teachersResponse = await fetch(`${URL}teachers?${query}`, options);
                    const teachers = await teachersResponse.json();

                    const schedules = await Promise.all(
                        teachers.map(async (teacher: Teacher) => {
                            const scheduleResponse = await fetch(`${URL}classes/get-monthly-schedule-by/${teacher.teacherid}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${user?.token}`,
                                },
                            });
                            const teacherSchedule = await scheduleResponse.json();
                            return { teacher, schedule: teacherSchedule };
                        })
                    );
                    const filteredSchedules = schedules.filter(({ schedule }) => schedule.length > 0);

                    setTeachersDictatingSubject(filteredSchedules);
                    setLoadingFetchTeachers(false);
                    
                } catch (error) {
                    console.error('Error fetching teachers dictating subjects:', error);
                    setLoadingFetchTeachers(false);
                }
        };
        const getSubjects = async () => {
          try {
            setLoadingFetchSubject(true);
            const options = {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              },
            };

            const subjectsResponse = await fetch(
              `${URL}subject/all-subjects-dictated`,
              options,
            );

            const subjects = await subjectsResponse.json();

            setSubjects(subjects.results);
            setLoadingFetchSubject(false)
          } catch(e) {
            console.log('getSubjects error', e);
            setLoadingFetchSubject(false)
          }
        }

        getTeachersDictatingSubject();
        getPrevTeachersDictatingSubject();
        getSubjects();
    }, [URL, subjectId, user?.id, user?.token]);

    const handleCardClick = (teacher: Teacher) => {
        const selectedTeacher = teachersDictatingSubject.find(t => t.teacher.teacherid === teacher.teacherid);
        if (selectedTeacher) {
            setClickedClass(selectedTeacher.teacher);
            setTeacherSchedule(selectedTeacher.schedule);
            setIsPopupOpen(true);
        }
    };

    const handlePopupClose = () => {
        setClickedClass(null);
        setIsPopupOpen(false);
    };

    const handleDayChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSlots = [...selectedSlots];
        newSlots[index].day = event.target.value;
        setSelectedSlots(newSlots);
    };

    const handleTimeChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSlots = [...selectedSlots];
        newSlots[index].time = event.target.value;
        setSelectedSlots(newSlots);
    };

    const addSlot = () => {
        if (selectedSlots.length < 5) {
            setSelectedSlots([...selectedSlots, { day: '', time: '' }]);
        }
    };

    const removeSlot = (index: number) => {
        const filteredSlots = selectedSlots.filter((_, i) => i !== index);
        setSelectedSlots(filteredSlots);
    }

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const handleBook = async (paymentMethod: string) => {
        try {
            if (paymentMethod === 'CASH') {
                setIsBooking(true);
            } else {
                setIsBookingWithCashFlow(true);
            }
        
            for (const slot of selectedSlots) {
                const selectedSchedule = teacherSchedule.find((schedule) => {
                    const [dayOfWeek, dayOfMonth] = slot.day.split(' ');
                    return (
                        schedule.teacherid === clickedClass?.teacherid &&
                        schedule.dayofweek == dayOfWeek &&
                        schedule.dayofmonth == dayOfMonth &&
                        formatTime(schedule.start_time) === slot.time
                    );
                });

                if (!selectedSchedule) {
                    setMessage('No matching schedule found for one or more slots');
                    throw new Error('No matching schedule found for one or more slots');
                }

                if (!slot.day || !slot.time) {
                    setMessage('Please select a day and time for all slots');
                    throw new Error('Please select a day and time for all slots');
                }

                const requestBody = {
                    student_id: user?.id,
                    subject_id: subjectId,
                    teacher_id: clickedClass?.teacherid,
                    dayofweek: parseInt(slot.day.split(' ')[0], 10),
                    start_time: `${slot.time}:00`,
                    schedule_id: selectedSchedule?.scheduleid,
                    payment_method: paymentMethod,
                };

                const response = await fetch(`${URL}reservation/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`,
                    },
                    body: JSON.stringify(requestBody),
                });
                if (response.status === 401) {
                    setMessage('User is not registered in CashFlow');
                    throw new Error('User is not registered in CashFlow');
                }
                if (!response.ok) {
                    setMessage('Failed to book class');
                    throw new Error('Failed to book class');
                }
            }

            setIsPopupOpen(false);
            setClickedClass(null);
            setMessage('Classes booked successfully');
            if (paymentMethod === 'CASH') {
                setIsBooking(false);
            } else {
                setIsBookingWithCashFlow(false);
            }
            setIsBookingTimeout(true);
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                setIsBookingTimeout(false);
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error(error);
            setShowErrorMessage(true);
            if (paymentMethod === 'CASH') {
                setIsBooking(false);
            } else {
                setIsBookingWithCashFlow(false);
            }
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
        }
    };

    const dayNames: { [key: string]: string } = {
        '1': 'Mon',
        '2': 'Tue',
        '3': 'Wed',
        '4': 'Thu',
        '5': 'Fri',
        '6': 'Sat',
        '7': 'Sun'
    };

    const formatTimeWithPadding = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const getAvailableDays = (schedules: Schedule[]) => {
        const days = Array.from(new Set(schedules.map(schedule => schedule.dayofweek)));
        return days.map(day => dayNames[day] || 'Unknown').join(', ');
    };

    const filteredTeachers = teachersDictatingSubject.filter(teacher =>
       `${teacher.teacher.firstname} ${teacher.teacher.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredPrevTeachers = prevTeachersDictatingSubject.filter(teacher =>
        `${teacher.teacher.firstname} ${teacher.teacher.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
     );

    const numStaticSkeletonCards = Math.max(0, 5 - filteredTeachers.length - prevTeachersDictatingSubject.length);
    const cardsToDisplay = [...filteredTeachers.map(item => item.teacher), ...Array(numStaticSkeletonCards).fill(null)];
    const prevTeacherscardsToDisplay = [...filteredPrevTeachers.map(item => item.teacher)];

    const handleCancelBooking = async () => {
        setSelectedSlots([{ day: '', time: '' }]);
        setIsPopupOpen(false);
    }

    return (
            <>
                {isPopupOpen && clickedClass != null &&
                <PopUpContainer>
                    <PopUp>
                        <CloseButton onClick={handlePopupClose}><RiCloseLargeFill/></CloseButton>
                        <LeftContainer>
                            <h3 style={{marginBottom: '0px', marginTop:'0px'}}>Teacher: {clickedClass.firstname} {clickedClass.lastname}</h3>
                            <p>Select a day and time for each slot</p>
                            {selectedSlots.map((slot, index) => (
                                <InputsContainer key={index}>
                                    <Select required onChange={(e) => handleDayChange(index, e)} value={slot.day}>
                                        <option value="">Select a day</option>
                                        {Array.from(new Set(teacherSchedule.map(schedule => `${schedule.dayofweek} ${schedule.dayofmonth}`)))
                                            .filter(day => !selectedSlots.some((selectedSlot, selectedIndex) => selectedIndex !== index && selectedSlot.day === day))
                                            .map(day => (
                                                <option key={day} value={day}>
                                                    {`${dayNames[day.split(' ')[0]]} ${day.split(' ')[1]}`}
                                                </option>
                                            ))}
                                    </Select>
                                    <Select required onChange={(e) => handleTimeChange(index, e)} value={slot.time}>
                                        <option value="">Select a time</option>
                                        {teacherSchedule
                                            .filter(schedule => `${schedule.dayofweek} ${schedule.dayofmonth}` === slot.day)
                                            .filter(schedule => !selectedSlots.some((selectedSlot, selectedIndex) => selectedIndex !== index && selectedSlot.time === formatTimeWithPadding(schedule.start_time) && selectedSlot.day === slot.day))
                                            .map(schedule => (
                                                <option key={schedule.scheduleid} value={formatTimeWithPadding(schedule.start_time)}>
                                                {schedule.maxstudents > 1 
                                                    ? formatTimeWithPadding(schedule.start_time) + "  (Group)"
                                                    : formatTimeWithPadding(schedule.start_time)}
                                                </option>

                                            ))}
                                    </Select>
                                    {index === 0 && (
                                        <SlotButton onClick={addSlot} disabled={selectedSlots.length >= 5}><GoPlus /></SlotButton>
                                    )}
                                    {index !== 0 && (
                                        <SlotButton remove onClick={() => removeSlot(index)}><GoDash /></SlotButton>
                                    )}
                                </InputsContainer>
                            ))}
                        </LeftContainer>
                        <RightContainer>
                                <h2 style={{marginBottom:'0px'}}>Summary</h2>
                                <SummaryContainer>
                                    {selectedSlots
                                        .filter(slot => slot.day && slot.time)
                                        .map((slot, index) => (
                                            <div key={index}>
                                                <p>Day: {dayNames[slot.day.split(' ')[0]]} | Time: {slot.time} | Price: $300</p>
                                            </div>
                                        ))}
                                        {selectedSlots.filter(slot => slot.day && slot.time).length !== 0 && (
                                            <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                                <p>Total Price: ${selectedSlots.length * 300}</p>
                                            </div>
                                        )}
                                    
                                </SummaryContainer>
                                <ButtonsContainer>
                                    <Button onClick={() => handleBook("CASH")}>{isBooking ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Book"}</Button>
                                    <PaymentButton disabled={true} onClick={() => handleBook("CASHFLOW")}>{isBookingWithCashFlow ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Book with Cash Flow"}<CashFlowProLogo src={CashFlowLogo}/></PaymentButton>
                                    <Button important onClick={handleCancelBooking}>Cancel</Button>
                                </ButtonsContainer>
                            </RightContainer>
                    </PopUp>
                </PopUpContainer>
            }
                <Logo/>
                <Topbar/>
                <MainContainer isPopupOpen={isPopupOpen}>
                
                {showSuccessMessage && <Message>{message}</Message>}
                {showErrorMessage && <Message error>{message}</Message>}
                {isBookingTimeout && <InteractionBlocker><AnimatedLoadingLogo src={SimplifiedLogo}/></InteractionBlocker>}
                    <SideBar />
                    <Content>
                        <BrowserWrapper style={{ flexDirection: 
                            loadingFetchTeachers || loadingFetchPreviousTeachers || loadingFetchSubjects || loadingApplyFilter ? 
                            "column"
                            : "row"
                        }}>
                            <Filter
                              filter={filter}
                              setFilter={setFilter}
                              subjects={subjects}
                              applyFilter={applyFilter}
                              clearFilter={clearFilter}
                            />
                            {loadingFetchTeachers || loadingFetchPreviousTeachers || loadingFetchSubjects || loadingApplyFilter ? (
                              <div style={{marginTop: '20px'}}>
                              <AnimatedLoadingLogo src={SimplifiedLogo}/>
                              </div>
                            ) : 
                                teachersDictatingSubject.length === 0 
                            ? 
                                <h1 style={{textAlign: "center"}}>No teachers available.</h1>
                                : (
                                <>
                                {prevTeacherscardsToDisplay.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%', borderBottom: '2px solid #ccc', marginBottom: '10px', paddingBottom: '10px' }}>
                                    <h2 style={{
                                    color: '#3e7d44',
                                      textAlign: "center", 
                                      backgroundColor: 'white',
                                      padding: '10px',
                                      borderRadius: '8px'
                                    }}>My previous teachers</h2>
                                        {prevTeacherscardsToDisplay.map((teacher, index) => (
                                            teacher ? (
                                                <Card 
                                                    key={teacher.teacherid}
                                                    onClick={() => handleCardClick(teacher)} 
                                                    role="button" 
                                                    tabIndex={0}
                                                    aria-label={`Teacher: ${teacher.firstname} ${teacher.lastname}`}
                                                >
                                                    <CardInfo>
                                                        <Title>{teacher.firstname} {teacher.lastname}</Title>
                                                        <Instructor>{getAvailableDays(teachersDictatingSubject.find(t => t.teacher.teacherid === teacher.teacherid)?.schedule || [])}</Instructor>
                                                    </CardInfo>
                                                </Card>
                                            ) : (
                                                <StaticSkeletonCard key={`skeleton-${index}`} />
                                            )
                                        ))}
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                                   <h2 style={{
                                    color: '#3e7d44',
                                    textAlign: "center", 
                                    backgroundColor: 'white',
                                    padding: '10px',
                                    borderRadius: '8px'
                                    }}>All teachers</h2>
                                   {cardsToDisplay.map((teacher, index) => (
                                     teacher ? (
                                       <Card 
                                       key={teacher.teacherid}
                                       onClick={() => handleCardClick(teacher)} 
                                       role="button" 
                                       tabIndex={0}
                                       aria-label={`Teacher: ${teacher.firstname} ${teacher.lastname}`}
                                       >
                                       <CardInfo>
                                       <Title>{teacher.firstname} {teacher.lastname}</Title>
                                       <Instructor>{getAvailableDays(teachersDictatingSubject.find(t => t.teacher.teacherid === teacher.teacherid)?.schedule || [])}</Instructor>
                                       </CardInfo>
                                       </Card>
                                      ) : (
                                        <StaticSkeletonCard key={`skeleton-${index}`} />
                                      )
                                    ))}
                                </div>
                                </>
                                )
                            }
                        </BrowserWrapper>
                    </Content>
                </MainContainer>
            </>
    );
};

interface FilterComponentProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  subjects: Subject[];
  applyFilter: () => void;
  clearFilter: () => void;
}

const Filter = ({ filter, setFilter, subjects, applyFilter, clearFilter }: FilterComponentProps) => {

  return(
    <div style={{ 
      display: 'flex', 
      // justifyContent: 'center', 
      flexDirection: 'column', 
      // alignItems: 'flex-start', 
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '0 20px'
      }}>
        <h2 style={{ color: '#3e7d44' }}>Filters</h2>

        <div
        style={{
      display: 'flex', 
      justifyContent: 'center', 
      flexDirection: 'column', 
      alignItems: 'flex-start', 
      gap: '10px'
      // padding: '0 20px'
        }}
        >
        <NameSearch
          value={filter.teacherName}
          onChange={(e: { target: { value: string; }; }) => setFilter(prev => ({...prev, teacherName: e.target.value}) )}
          />

        <SubjectSelect
          subjects={subjects}
          value={filter.subject}
          onChange={e => setFilter(prev => ({...prev, subject: e.target.value}) )}
          />
      <AvailableDays 
        value={filter.weekdays}
        onChange={(weekdays: string[]) => setFilter(prev => ({...prev, weekdays: weekdays}) )}
        />
       <IndividualOrGroup
        value={filter.individual}
        onChange={(individual: boolean) => setFilter(prev => ({...prev, individual}) )}
        />
        <TimeRanges
          value={filter.timeRanges}
          onChange={(timeRanges: { from: string, to: string }) => setFilter(prev => ({...prev, timeRanges}) )}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', margin: '10px 0', alignSelf: 'flex-end' }}>
          <button style={{
            backgroundColor: 'red',
          }}
          onClick={clearFilter}>Clear Filters</button>
          <button 
          
          style={{
            backgroundColor: '#3e7d44',
          }}
          onClick={applyFilter}>Apply Filters</button>
        </div>
    </div>
  )
}

interface FilterItemProps {
  label: string;
  children: React.ReactNode;
};
const FilterItem = ({ label, children }: FilterItemProps) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
     // marginBottom: '10px' 
      }}>
      <label style={{ marginBottom: '6px',
      fontWeight: 'bold',
      color: '#3e7d44',
      }}>{label}</label>
      {children}
    </div>
  );
}


interface NameSearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NameSearch = ({ value, onChange }: NameSearchProps) => {
  return (
    <FilterItem label="Teacher Name:">
        <input
            style={{
                width: '250px',
                background: '#ffffff',
                borderRadius: '5px',
                fontSize: '16px',
                color: '#3e7d44',
                border: 'solid 1px #3e7d44',
                height: '36px',
            }}
            type="text"
            value={value}
            onChange={onChange}
        />
    </FilterItem>
    )
};

interface SubjectSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  subjects: Subject[];
}

const SubjectSelect = ({ value, onChange, subjects = [] }: SubjectSelectProps) => {
  return (

    <FilterItem label="Subject:">
      <select value={value} id="subject" onChange={onChange}
      style={{
                width: '250px',
                background: '#ffffff',
                borderRadius: '5px',
                fontSize: '16px',
                height: '36px',
                border: 'solid 1px #3e7d44',
                color: '#3e7d44',
      }}
      >
        <option value={''}>All Subjects</option>
        {subjects.map((subject: Subject) => (
          <option key={subject.subjectid} value={subject.subjectid}>
            {subject.subjectname}
          </option>
        ))}
      </select>
    </FilterItem>
  );
};


interface AvailableDaysProps {
  value: string[];
  onChange: (weekdays: string[]) => void;
};
const AvailableDays = ({ value, onChange }: AvailableDaysProps) => {
  function toggleOption(option: string, isSelected: boolean) {
    if (isSelected) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  }

  return (
    <FilterItem label="Available Days:">
      <div style={{ display: "flex", gap: "8px" }}>
        {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((day, idx) => {
          const isSelected = value.includes(day);
          return (
            <div key={idx}>
              <input
                type="checkbox"
                id={day}
                value={idx}
                checked={isSelected}
                onChange={() => toggleOption(day, isSelected)}
                style={{ display: "none" }}
              />
              <label
                htmlFor={day}
                style={{
                  cursor: "pointer",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  backgroundColor: isSelected ? "#3e7d44" : "white",
                  color: isSelected ? "white" : "black",
                  userSelect: "none",
                }}
              >
                {day}
              </label>
            </div>
          );
        })}
      </div>
    </FilterItem>
  );
};

interface IndividualOrGroupProps {
  value: boolean | null;
  onChange: (individual: boolean) => void;
}

const IndividualOrGroup = ({ value, onChange }: IndividualOrGroupProps) => {
  return (
    <FilterItem label="Individual or Group class:">
      <div style={{
        border: '1px solid #3e7d44',
        borderRadius: '8px',
        padding: '7px 0',
        width: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
      }}>
        <div>
      <input 
      style={{
        margin: '0',
//        ['-webkit-appearance']: 'none',
//        '-moz-appearance': 'none',
        'appearance': 'none',
      }}
      type='radio' value='individual' id='individual' checked={!!value} onChange={() => onChange(true)} />
      <label 
      style={{
        backgroundColor: value ? '#3e7d44' : 'white',
        color: value ? 'white' : 'black',
        cursor: 'pointer',
        padding:'8px',
        borderRadius: '6px',
        margin: '0px',
      }}
      htmlFor='individual' 
      
      >Individual</label>
        </div>

        <div>
      <input
      style={{
        margin: '0',
        appearance: 'none',
      }}
      type='radio' value='group' id='group' checked={value === false} onChange={() => onChange(false)} />
      <label
      
      style={{
        margin: '0px',
        backgroundColor: !value ? '#3e7d44' : 'white',
        color: !value ? 'white' : 'black',
        cursor: 'pointer',
        padding:'8px',
        borderRadius: '6px'
      }}
      
      htmlFor='group'>Group</label>
      </div>
        </div>
    </FilterItem>
  )
}

interface TimeRangesProps {
  value: { from: string; to: string };
  onChange: (timeRanges: { from: string; to: string }) => void;
}

const TimeRanges = ({ value, onChange }: TimeRangesProps) => {
  const { from, to } = value;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;
    onChange({ ...value, [name]: inputValue });
  }
  return (
      <FilterItem label="Time Range:">
        <div
       style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '10px'
       }} 
        >
<div style={{display:'flex',flexDirection:'column'}}>
            <label style={{color: 'black'}}>From:</label>
            <TimeInput
              type="time"
              id="from"
              name="from"
              step="3600"
              value={from}
              min="08:00"
              max={to}
              onChange={handleChange}
            />
      </div>

<div style={{display:'flex',flexDirection:'column'}}>
      <label style={{color: 'black'}}>To: </label>
        <TimeInput
          type="time"
          id="to"
          name="to"
          step="3600"
          value={to}
          min={from}
          max="21:00"
          onChange={handleChange}
        />
</div>
      </div>
    </FilterItem>
  )
};

export default ClassBrowser;
