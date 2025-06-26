<template>
    <div class="workspace-container">
        <!-- 헤더 영역 -->
        <div class="workspace-header">
            <h1 class="workspace-title">워크스페이스</h1>
            <button class="add-schedule-btn" @click="showAddScheduleModal = true">
                + 일정 추가
            </button>
        </div>

        <!-- 캘린더 네비게이션 -->
        <div class="calendar-nav">
            <button class="nav-btn" @click="previousMonth">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <h2 class="current-month">{{ currentMonthYear }}</h2>
            <button class="nav-btn" @click="nextMonth">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>

        <!-- 캘린더 그리드 -->
        <div class="calendar-container">
            <div class="calendar-header">
                <div v-for="day in weekDays" :key="day" class="day-header">
                    {{ day }}
                </div>
            </div>
            <div class="calendar-grid">
                <div 
                    v-for="date in calendarDates" 
                    :key="date.key"
                    :class="['calendar-date', {
                        'other-month': !date.isCurrentMonth,
                        'today': date.isToday,
                        'selected': isDateSelected(date.date),
                        'has-events': date.events.length > 0
                    }]"
                    @click="selectDate(date.date)"
                >
                    <span class="date-number">{{ date.day }}</span>
                    <div v-if="date.events.length > 0" class="events-container">
                        <div 
                            v-for="(event, index) in date.events.slice(0, 3)" 
                            :key="event.id"
                            :class="['event-bar', getEventBarClass(event, date.date)]"
                            :style="{ 
                                backgroundColor: event.color, 
                                top: `${24 + index * 18}px`
                            }"
                        >
                            <span v-if="isEventStart(event, date.date)" class="event-title-bar">
                                {{ event.title }}
                            </span>
                        </div>
                        <span v-if="date.events.length > 3" class="more-events">
                            +{{ date.events.length - 3 }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 선택된 날짜의 일정 목록 -->
        <div v-if="selectedDate" class="selected-date-events">
            <h3 class="events-title">{{ formatSelectedDate }} 일정</h3>
            <div v-if="selectedDateEvents.length === 0" class="no-events">
                등록된 일정이 없습니다.
            </div>
            <div v-else class="events-list">
                <div 
                    v-for="event in selectedDateEvents" 
                    :key="event.id"
                    class="event-item"
                    :style="{ borderLeftColor: event.color }"
                >
                    <div class="event-info">
                        <h4 class="event-title">{{ event.title }}</h4>
                        <p class="event-time">{{ formatDateRange(event.startDate, event.endDate) }}</p>
                        <p v-if="event.description" class="event-description">{{ event.description }}</p>
                    </div>
                    <button class="delete-event-btn" @click="deleteEvent(event.id)">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- 일정 추가 모달 -->
        <div v-if="showAddScheduleModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>일정 추가</h3>
                    <button class="close-btn" @click="closeModal">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                <form @submit.prevent="addSchedule" class="schedule-form">
                    <div class="form-group">
                        <label>제목</label>
                        <input 
                            type="text" 
                            v-model="newSchedule.title" 
                            placeholder="일정 제목을 입력하세요"
                            required
                            class="form-input"
                        />
                    </div>
                    <div class="form-row">
                        <div class="form-group half">
                            <label>시작 날짜</label>
                            <input 
                                type="date" 
                                v-model="newSchedule.startDate" 
                                required
                                class="form-input"
                            />
                        </div>
                        <div class="form-group half">
                            <label>종료 날짜</label>
                            <input 
                                type="date" 
                                v-model="newSchedule.endDate" 
                                required
                                class="form-input"
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>설명 (선택사항)</label>
                        <textarea 
                            v-model="newSchedule.description" 
                            placeholder="일정에 대한 설명을 입력하세요"
                            class="form-textarea"
                            rows="3"
                        ></textarea>
                    </div>
                    <div class="form-group">
                        <label>색상</label>
                        <div class="color-picker">
                            <div 
                                v-for="color in availableColors" 
                                :key="color"
                                :class="['color-option', { selected: newSchedule.color === color }]"
                                :style="{ backgroundColor: color }"
                                @click="newSchedule.color = color"
                            ></div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn" @click="closeModal">취소</button>
                        <button type="submit" class="submit-btn">추가</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WorkSpaceScreen',
    data() {
        return {
            currentDate: new Date(),
            selectedDate: null,
            showAddScheduleModal: false,
            weekDays: ['일', '월', '화', '수', '목', '금', '토'],
            availableColors: ['#4A90E2', '#7ED321', '#F5A623', '#D0021B', '#9013FE', '#50E3C2'],
            events: [], // 추후 백엔드에서 가져올 데이터
            newSchedule: {
                title: '',
                startDate: '',
                endDate: '',
                description: '',
                color: '#4A90E2'
            }
        };
    },
    computed: {
        currentMonthYear() {
            return this.currentDate.toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long' 
            });
        },
        calendarDates() {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDate = new Date(firstDay);
            const endDate = new Date(lastDay);

            // 달력 시작일 (이전 달의 마지막 주)
            startDate.setDate(startDate.getDate() - startDate.getDay());
            // 달력 종료일 (다음 달의 첫 주)
            endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

            const dates = [];
            const current = new Date(startDate);

            while (current <= endDate) {
                const dateStr = this.formatDate(current);
                const dayEvents = this.events.filter(event => 
                    this.isDateInRange(dateStr, event.startDate, event.endDate)
                );
                
                dates.push({
                    date: new Date(current),
                    day: current.getDate(),
                    isCurrentMonth: current.getMonth() === month,
                    isToday: this.isToday(current),
                    events: dayEvents,
                    key: current.toISOString()
                });
                current.setDate(current.getDate() + 1);
            }
            return dates;
        },
        selectedDateEvents() {
            if (!this.selectedDate) return [];
            const selectedDateStr = this.formatDate(this.selectedDate);
            return this.events.filter(event => 
                this.isDateInRange(selectedDateStr, event.startDate, event.endDate)
            );
        },
        formatSelectedDate() {
            if (!this.selectedDate) return '';
            return this.selectedDate.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });
        }
    },
    methods: {
        previousMonth() {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        },
        nextMonth() {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        },
        selectDate(date) {
            this.selectedDate = date;
        },
        isDateSelected(date) {
            return this.selectedDate && this.formatDate(date) === this.formatDate(this.selectedDate);
        },
        isToday(date) {
            const today = new Date();
            return date.toDateString() === today.toDateString();
        },
        formatDate(date) {
            return date.toISOString().split('T')[0];
        },
        closeModal() {
            this.showAddScheduleModal = false;
            this.resetNewSchedule();
        },
        resetNewSchedule() {
            this.newSchedule = {
                title: '',
                startDate: '',
                endDate: '',
                description: '',
                color: '#4A90E2'
            };
        },
        addSchedule() {
            // 기본 유효성 검사
            if (!this.newSchedule.title.trim()) return;
            if (!this.newSchedule.startDate) return;
            if (!this.newSchedule.endDate) return;
            if (this.newSchedule.startDate > this.newSchedule.endDate) {
                alert('종료 날짜는 시작 날짜보다 늦어야 합니다.');
                return;
            }

            const newEvent = {
                id: Date.now(), // 임시 ID (추후 백엔드에서 생성)
                title: this.newSchedule.title.trim(),
                startDate: this.newSchedule.startDate,
                endDate: this.newSchedule.endDate,
                description: this.newSchedule.description.trim(),
                color: this.newSchedule.color
            };

            // 로컬 상태에 추가 (추후 백엔드 API 호출로 대체)
            this.events.push(newEvent);
            
            // TODO: 백엔드 API 호출
            // this.postScheduleToBackend(newEvent);
            
            this.closeModal();
            console.log('일정 추가됨:', newEvent);
        },
        deleteEvent(eventId) {
            if (confirm('이 일정을 삭제하시겠습니까?')) {
                this.events = this.events.filter(event => event.id !== eventId);
                
                // TODO: 백엔드 API 호출
                // this.deleteScheduleFromBackend(eventId);
                
                console.log('일정 삭제됨:', eventId);
            }
        },
        isDateInRange(dateStr, startDate, endDate) {
            return dateStr >= startDate && dateStr <= endDate;
        },
        isEventStart(event, date) {
            return this.formatDate(date) === event.startDate;
        },
        isEventEnd(event, date) {
            return this.formatDate(date) === event.endDate;
        },
        isSingleDayEvent(event) {
            return event.startDate === event.endDate;
        },
        getEventBarClass(event, date) {
            const dateStr = this.formatDate(date);
            const isStart = dateStr === event.startDate;
            const isEnd = dateStr === event.endDate;
            const isSingle = this.isSingleDayEvent(event);
            
            if (isSingle) {
                return 'single-day';
            } else if (isStart) {
                return 'start-day';
            } else if (isEnd) {
                return 'end-day';
            } else {
                return 'middle-day';
            }
        },
        formatDateRange(startDate, endDate) {
            const start = new Date(startDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            const end = new Date(endDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            if (startDate === endDate) {
                return start;
            }
            return `${start} - ${end}`;
        },
        // 추후 백엔드 연동용 메서드들
        async postScheduleToBackend(schedule) {
            // TODO: 실제 API 호출 구현
            console.log('백엔드로 일정 전송:', schedule);
        },
        async deleteScheduleFromBackend(scheduleId) {
            // TODO: 실제 API 호출 구현
            console.log('백엔드에서 일정 삭제:', scheduleId);
        },
        async fetchSchedulesFromBackend() {
            // TODO: 실제 API 호출 구현
            console.log('백엔드에서 일정 목록 가져오기');
        }
    },
    mounted() {
        // 컴포넌트 마운트 시 오늘 날짜 선택
        this.selectedDate = new Date();
        
        // TODO: 백엔드에서 일정 목록 가져오기
        // this.fetchSchedulesFromBackend();
    }
}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");

.workspace-container {
    font-family: "Pretendard Variable", Pretendard, sans-serif;
    width: 90%;
    margin: 0 auto;
    color: #E0E0E0;
    min-height: 100vh;
    box-sizing: border-box;
}

.workspace-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 16px;
}

.workspace-title {
    font-size: 2rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
}

.add-schedule-btn {
    background: #4A90E2;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
}

.add-schedule-btn:hover {
    background: #357ABD;
}

.calendar-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 10px;
}

.nav-btn {
    background: #2D2D2D;
    border: none;
    color: #A0A0A0;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-btn:hover {
    background: #3A3A3A;
    color: #fff;
}

.current-month {
    font-size: 1.5rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
    text-align: center;
    flex: 1;
}

.calendar-container {
    background: #232323;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 30px;
    width: 100%;
}

.calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: #2D2D2D;
}

.day-header {
    padding: 16px 8px;
    text-align: center;
    font-weight: 600;
    color: #A0A0A0;
    font-size: 14px;
    min-height: 20px;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: #2D2D2D;
}

.calendar-date {
    min-height: 120px;
    padding: 8px;
    background: #232323;
    cursor: pointer;
    transition: background 0.2s;
    position: relative;
    display: flex;
    flex-direction: column;
}

.calendar-date:hover {
    background: #2D2D2D;
}

.calendar-date.other-month {
    color: #555;
    background: #1A1A1A;
}

.calendar-date.today {
    background: #4A90E2;
    color: white;
}

.calendar-date.selected {
    background: #357ABD;
    color: white;
}

.calendar-date.has-events .date-number {
    font-weight: 600;
}

.date-number {
    display: block;
    font-size: 14px;
    margin-bottom: 4px;
    line-height: 1.2;
}

.events-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.event-bar {
    position: absolute;
    height: 14px;
    left: 2px;
    right: 2px;
    border-radius: 4px;
    font-size: 10px;
    color: white;
    display: flex;
    align-items: center;
    overflow: hidden;
    z-index: 1;
    margin: 2px 0;
}

.event-bar.single-day {
    border-radius: 6px;
    left: 4px;
    right: 4px;
}

.event-bar.start-day {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    right: 0;
}

.event-bar.end-day {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    left: 0;
}

.event-bar.middle-day {
    border-radius: 0;
    left: 0;
    right: 0;
}

.event-title-bar {
    padding-left: 4px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 8px;
    line-height: 1;
}

.more-events {
    position: absolute;
    bottom: 2px;
    right: 2px;
    font-size: 8px;
    color: #A0A0A0;
    background: rgba(0, 0, 0, 0.7);
    padding: 1px 3px;
    border-radius: 2px;
    z-index: 2;
}

.events-indicator {
    display: none; /* 기존 점 표시 숨김 */
}

/* 기존 event-dot 스타일 제거하거나 숨김 */
.event-dot {
    display: none;
}

.selected-date-events {
    background: #232323;
    border-radius: 12px;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
}

.events-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #fff;
    margin: 0 0 16px 0;
}

.no-events {
    color: #A0A0A0;
    text-align: center;
    padding: 20px;
}

.events-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.event-item {
    background: #2D2D2D;
    border-radius: 8px;
    padding: 16px;
    border-left: 4px solid;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.event-info {
    flex: 1;
}

.event-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 4px 0;
}

.event-time {
    font-size: 14px;
    color: #A0A0A0;
    margin: 0 0 8px 0;
}

.event-description {
    font-size: 14px;
    color: #B0B0B0;
    margin: 0;
}

.delete-event-btn {
    background: none;
    border: none;
    color: #A0A0A0;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.2s;
}

.delete-event-btn:hover {
    color: #D0021B;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #232323;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 0 20px;
}

.modal-header h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    color: #A0A0A0;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: color 0.2s;
}

.close-btn:hover {
    color: #fff;
}

.schedule-form {
    padding: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-weight: 500;
    color: #fff;
    margin-bottom: 8px;
    font-size: 14px;
}

.form-row {
    display: flex;
    gap: 16px;
}

.form-group.half {
    flex: 1;
}

.form-input, .form-textarea {
    width: 100%;
    padding: 12px;
    background: #2D2D2D;
    border: 1px solid #3A3A3A;
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    box-sizing: border-box;
}

.form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: #4A90E2;
}

.form-textarea {
    resize: vertical;
    min-height: 80px;
}

.color-picker {
    display: flex;
    gap: 8px;
}

.color-option {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid transparent;
    transition: border-color 0.2s;
}

.color-option.selected {
    border-color: #fff;
}

.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
}

.cancel-btn {
    background: #3A3A3A;
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
}

.cancel-btn:hover {
    background: #4A4A4A;
}

.submit-btn {
    background: #4A90E2;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.submit-btn:hover {
    background: #357ABD;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
    .workspace-container {
        padding: 16px;
    }
    
    .workspace-title {
        font-size: 1.5rem;
    }
    
    .add-schedule-btn {
        padding: 10px 20px;
        font-size: 13px;
    }
    
    .current-month {
        font-size: 1.2rem;
    }
    
    .calendar-date {
        min-height: 80px;
        padding: 6px;
    }
    
    .date-number {
        font-size: 13px;
    }
    
    .day-header {
        padding: 12px 4px;
        font-size: 12px;
    }
    
    .event-dot {
        width: 4px;
        height: 4px;
    }
    
    .more-events {
        font-size: 9px;
    }
}

@media (max-width: 480px) {
    .workspace-container {
        padding: 12px;
    }
    
    .workspace-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }
    
    .workspace-title {
        font-size: 1.3rem;
        text-align: center;
    }
    
    .add-schedule-btn {
        width: 100%;
        justify-content: center;
    }
    
    .calendar-date {
        min-height: 60px;
        padding: 4px;
    }
    
    .date-number {
        font-size: 12px;
    }
    
    .day-header {
        padding: 8px 2px;
        font-size: 11px;
    }
    
    .current-month {
        font-size: 1.1rem;
    }
    
    .nav-btn {
        min-width: 32px;
        height: 32px;
    }
    
    .selected-date-events {
        padding: 16px;
    }
}

@media (min-width: 1400px) {
    .workspace-container {
        padding: 40px;
    }
    
    .calendar-date {
        min-height: 140px;
    }
}
</style>
