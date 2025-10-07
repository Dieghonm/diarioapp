import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';
import { MONTHS, DAYS_OF_WEEK } from '../utils/constants';
import { getCalendarDays } from '../utils/dateUtils';

const Calendar = ({ entries, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const days = getCalendarDays(currentMonth, currentYear);

  const hasEntry = (day) => {
    if (!day) return false;
    
    return entries.some(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate.getDate() === day &&
             entryDate.getMonth() === currentMonth &&
             entryDate.getFullYear() === currentYear;
    });
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayPress = (day) => {
    if (day) {
      setSelectedDay(day);
      const date = new Date(currentYear, currentMonth, day);
      onSelectDate && onSelectDate(date);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <Text style={styles.navText}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.monthYear}>
          {MONTHS[currentMonth]} {currentYear}
        </Text>
        
        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Text style={styles.navText}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {DAYS_OF_WEEK.map((day, index) => (
          <Text key={index} style={styles.weekDay}>{day}</Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              !day && styles.emptyDay,
              day === selectedDay && styles.selectedDay,
              hasEntry(day) && styles.dayWithEntry,
            ]}
            onPress={() => handleDayPress(day)}
            disabled={!day}
            activeOpacity={0.7}
          >
            {day && (
              <>
                <Text style={[
                  styles.dayText,
                  day === selectedDay && styles.selectedDayText,
                  hasEntry(day) && styles.dayWithEntryText,
                ]}>
                  {day}
                </Text>
                {hasEntry(day) && <View style={styles.entryDot} />}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    marginHorizontal: 150,
    borderWidth: 1,
    borderColor: COLORS.lightPink,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightPink,
  },
  navButton: {
    padding: 10,
  },
  navText: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  monthYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDay: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMedium,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    position: 'relative',
  },
  emptyDay: {
    opacity: 0,
  },
  dayText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  selectedDay: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  selectedDayText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  dayWithEntry: {
    backgroundColor: COLORS.lightPink,
    borderRadius: 20,
  },
  dayWithEntryText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  entryDot: {
    position: 'absolute',
    bottom: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
});

export default Calendar;