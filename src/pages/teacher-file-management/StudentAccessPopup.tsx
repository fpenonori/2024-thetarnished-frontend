// import React, { useState, useEffect, useMemo } from 'react';
// import styled from 'styled-components';
// import DataTable, { TableColumn } from 'react-data-table-component';
// import colors from '../../assets/colors';

// interface Student {
//     student_id: string;
//     name: string;
//     email: string;
//     hasAccess: boolean;
// }

// interface StudentWithAccess extends Student {
//     hasAccess: boolean;
// }

// interface Props {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave: (updatedStudents: StudentWithAccess[]) => void;
//     students: StudentWithAccess[];
// }

// const PopupOverlay = styled.div`
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     background-color: rgba(0, 0, 0, 0.5);
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     z-index: 1000;
// `;

// const PopupContainer = styled.div`
//     background: white;
//     width: 600px;
//     height: 80vh;
//     border-radius: 8px;
//     padding: 20px;
//     display: flex;
//     flex-direction: column;
//     box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
//     position: relative;
// `;

// const CloseButton = styled.button`
//     position: absolute;
//     top: 10px;
//     right: 10px;
//     background: transparent;
//     border: none;
//     font-size: 1.5em;
//     cursor: pointer;
//     color: ${colors.primary};

//     &:hover {
//         color: #0056b3;
//     }
// `;

// const TableContainer = styled.div`
//     flex: 1;
//     overflow-y: auto;
//     margin-bottom: 10px;
// `;

// const SaveButton = styled.button`
//     background-color: ${colors.primary};
//     color: white;
//     border: none;
//     border-radius: 4px;
//     padding: 10px;
//     cursor: pointer;
//     font-size: 1em;
//     &:hover {
//         background-color: #0056b3;
//     }
// `;

// const TextField = styled.input`
//     height: 32px;
//     width: 200px;
//     border-radius: 3px;
//     border-top-left-radius: 5px;
//     border-bottom-left-radius: 5px;
//     border-top-right-radius: 0;
//     border-bottom-right-radius: 0;
//     border: 1px solid #e5e5e5;
//     padding: 0 32px 0 16px;

//     &:hover {
//         cursor: pointer;
//     }
// `;

// const ClearButton = styled.button`
//     border-top-left-radius: 0;
//     border-bottom-left-radius: 0;
//     border-top-right-radius: 5px;
//     border-bottom-right-radius: 5px;
//     height: 34px;
//     width: 32px;
//     text-align: center;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background-color: ${colors.primary};
//     color: white;
//     border: none;
//     cursor: pointer;

//     &:hover {
//         background-color: #0056b3;
//     }
// `;

// const FilterComponent = ({ filterText, onFilter, onClear }) => (
//     <>
//         <TextField
//             id="search"
//             type="text"
//             placeholder="Filter By Name"
//             aria-label="Search Input"
//             value={filterText}
//             onChange={onFilter}
//         />
//         <ClearButton type="button" onClick={onClear}>
//             X
//         </ClearButton>
//     </>
// );

// const StudentAccessPopup: React.FC<Props> = ({ isOpen, onClose, onSave, students }) => {
//     const [studentData, setStudentData] = useState<StudentWithAccess[]>(students);
//     const [filterText, setFilterText] = useState('');

//     useEffect(() => {
//         setStudentData(students.map(student => ({
//             ...student,
//             hasAccess: student.hasAccess ?? false,
//         })));
//     }, [students]);

//     const handleAccessToggle = (id: string) => {
//         setStudentData(prevData =>
//             prevData.map(student =>
//                 student.student_id === id ? { ...student, hasAccess: !student.hasAccess } : student
//             )
//         );
//     };

//     const handleSave = () => {
//         onSave(studentData);
//         onClose();
//     };

//     // Filtrar estudiantes por nombre usando el texto del filtro
//     const filteredStudents = useMemo(() => {
//         return studentData.filter(student =>
//             student.name.toLowerCase().includes(filterText.toLowerCase())
//         );
//     }, [filterText, studentData]);

//     const subHeaderComponentMemo = useMemo(() => {
//         const handleClear = () => {
//             if (filterText) {
//                 setFilterText('');
//             }
//         };

//         return (
//             <FilterComponent
//                 onFilter={e => setFilterText(e.target.value)}
//                 onClear={handleClear}
//                 filterText={filterText}
//             />
//         );
//     }, [filterText]);

//     // Columnas para react-data-table-component
//     const columns: TableColumn<Student>[] = [
//         {
//             name: 'Full Name',
//             selector: row => row.name,
//             sortable: true,
//         },
//         {
//             name: 'Email',
//             selector: row => row.email,
//             sortable: true,
//         },
//         {
//             name: 'Allow Access?',
//             cell: row => (
//                 <input
//                     type="checkbox"
//                     checked={row.hasAccess}
//                     onChange={() => handleAccessToggle(row.student_id)}
//                 />
//             ),
//             ignoreRowClick: true,
//             allowOverflow: true,
//         },
//     ];

//     if (!isOpen) return null;

//     return (
//         <PopupOverlay>
//             <PopupContainer>
//                 <CloseButton onClick={onClose}>&times;</CloseButton>
//                 <TableContainer>
//                     <DataTable
//                         title="File Access Management"
//                         columns={columns}
//                         data={filteredStudents}
//                         subHeader
//                         subHeaderComponent={subHeaderComponentMemo}
//                         pointerOnHover
//                         highlightOnHover
//                     />
//                 </TableContainer>
//                 <SaveButton onClick={handleSave}>Save Changes</SaveButton>
//             </PopupContainer>
//         </PopupOverlay>
//     );
// };

// export default StudentAccessPopup;

// StudentAccessPopup.tsx
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import DataTable, { TableColumn } from 'react-data-table-component';
import colors from '../../assets/colors';

interface Student {
    student_id: string;
    name: string;
    email: string;
    hasAccess: boolean;
}

interface StudentWithAccess extends Student {
    hasAccess: boolean;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedStudents: StudentWithAccess[]) => void;
    students: StudentWithAccess[];
}

const PopupOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const PopupContainer = styled.div`
    background: white;
    width: 600px;
    height: 50vh;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    position: relative;
`;

// const CloseButton = styled.button`
//     border-top-left-radius: 0;
//     border-bottom-left-radius: 0;
//     border-top-right-radius: 5px;
//     border-bottom-right-radius: 5px;
//     border-top-left-radius: 5px;
//     border-bottom-left-radius: 5px;
//     height: 34px;
//     width: 32px;
//     text-align: center;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background-color: ${colors.primary};
//     color: white;
//     border: none;
//     cursor: pointer;
//     font-size: 18px

//     &:hover {
//         background-color: #0056b3;
//     }
// `;

const CloseButton = styled.button`
    position: absolute; // This positions the button relative to the popup container
    top: 10px; // Adjusts vertical alignment
    right: 10px; // Moves the button to the right within the container
    background-color: ${colors.primary}; // Background color, similar to the clear button
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    color: white; // Text color
    border: none;
    border-radius: 4px;
    height: 34px;
    width: 34px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;
    cursor: pointer;
    z-index: 1001; // Ensure the button is above the table
    &:hover {
        background-color: #0056b3; // Hover color
    }
`;

const TableContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    margin-bottom: 10px;
`;

const SaveButton = styled.button`
    background-color: ${colors.primary};
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px;
    cursor: pointer;
    font-size: 1em;
    &:hover {
        background-color: #0056b3;
    }
`;

const TextField = styled.input`
    height: 32px;
    width: 200px;
    border-radius: 3px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid #e5e5e5;
    padding: 0 32px 0 16px;

    &:hover {
        cursor: pointer;
    }
`;

const ClearButton = styled.button`
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    height: 34px;
    width: 32px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${colors.primary};
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
        <TextField
            id="search"
            type="text"
            placeholder="Filter By Name"
            aria-label="Search Input"
            value={filterText}
            onChange={onFilter}
        />
        <ClearButton type="button" onClick={onClear}>
            X
        </ClearButton>
    </>
);

const StudentAccessPopup: React.FC<Props> = ({ isOpen, onClose, onSave, students }) => {
    const [studentData, setStudentData] = useState<StudentWithAccess[]>(students);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        setStudentData(students.map(student => ({
            ...student,
            hasAccess: student.hasAccess ?? false,
        })));
    }, [students]);

    const handleAccessToggle = (id: string) => {
        setStudentData(prevData =>
            prevData.map(student =>
                student.student_id === id ? { ...student, hasAccess: !student.hasAccess } : student
            )
        );
    };

    const handleSave = () => {
        onSave(studentData);
        onClose();
    };

    // Filtrar estudiantes por nombre usando el texto del filtro
    const filteredStudents = useMemo(() => {
        return studentData.filter(student =>
            student.name.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [filterText, studentData]);

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setFilterText('');
            }
        };

        return (
            <FilterComponent
                onFilter={e => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
            />
        );
    }, [filterText]);

    // Columnas para react-data-table-component
    const columns: TableColumn<Student>[] = [
        {
            name: 'Full Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Allow Access?',
            cell: row => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <input
                        type="checkbox"
                        checked={row.hasAccess}
                        onChange={() => handleAccessToggle(row.student_id)}
                    />
                </div>
            ),
            //     name: 'Allow Access?',
            //     cell: row => (
            //         <input
            //             type="checkbox"
            //             checked={row.hasAccess}
            //             onChange={() => handleAccessToggle(row.student_id)}
            //         />
            //     ),
            //     ignoreRowClick: true,
            //     allowOverflow: true,
            // },
        }];

    if (!isOpen) return null;

    return (
        <PopupOverlay>
            <PopupContainer>
                <CloseButton onClick={onClose} aria-label="Close Popup">X</CloseButton>
                <TableContainer>
                    <DataTable
                        title="File Access Management"
                        columns={columns}
                        data={filteredStudents}
                        subHeader
                        subHeaderComponent={subHeaderComponentMemo}
                        pointerOnHover
                        highlightOnHover
                    />
                </TableContainer>
                <SaveButton onClick={handleSave}>Save Changes</SaveButton>
            </PopupContainer>
        </PopupOverlay>
    );
};

export default StudentAccessPopup;
