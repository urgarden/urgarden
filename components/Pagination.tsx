import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <View style={styles.paginationContainer}>
      {/* Previous Button */}
      <TouchableOpacity
        style={[styles.button, currentPage === 1 && styles.disabledButton]}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Text style={styles.buttonText}>Previous</Text>
      </TouchableOpacity>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <TouchableOpacity
            key={index}
            style={[styles.button, currentPage === page && styles.activeButton]}
            onPress={() => onPageChange(page)}
          >
            <Text
              style={[
                styles.buttonText,
                currentPage === page && styles.activeButtonText,
              ]}
            >
              {page}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text key={index} style={styles.ellipsis}>
            {page}
          </Text>
        )
      )}

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.button,
          currentPage === totalPages && styles.disabledButton,
        ]}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  activeButton: {
    backgroundColor: "#2E7D32",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  activeButtonText: {
    fontWeight: "bold",
  },
  ellipsis: {
    fontSize: 16,
    color: "#333",
    marginHorizontal: 4,
  },
});

export default Pagination;
