import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Button } from '../../components/main-button/components';

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
    max-height: 80vh; /* Ensure it doesn't take full screen height */
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    position: relative;
`;

const CloseButton = styled(Button)`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #D9534F;
    color: white;
    border: none;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    &:hover {
        background-color: #C9302C;
    }
`;

const TableContainer = styled.div`
    flex: 1;
    margin-bottom: 10px;
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
        <Button secondary onClick={onClear} style={{height: '32 px'}}>
            X
        </Button>
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
                        fixedHeader
                        fixedHeaderScrollHeight='20vh'
                        subHeader
                        subHeaderComponent={subHeaderComponentMemo}
                    />
                </TableContainer>
                <Button onClick={handleSave}>Save Changes</Button>
            </PopupContainer>
        </PopupOverlay>
    );
};

export default StudentAccessPopup;
