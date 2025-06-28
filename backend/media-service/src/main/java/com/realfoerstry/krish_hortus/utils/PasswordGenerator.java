package com.realfoerstry.krish_hortus.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Random;

@Slf4j
@Service
public class PasswordGenerator {

    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String LIMITED_SPECIAL = "!@#$%&*"; // Limited special characters
    private static final Random RANDOM = new SecureRandom();
    private static final int PASSWORD_LENGTH = 16;

    public static String generatePassword() {
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

        // Ensure at least one character from each set
        password.append(getRandomChar(UPPER));
        password.append(getRandomChar(LOWER));
        password.append(getRandomChar(DIGITS));
        password.append(getRandomChar(LIMITED_SPECIAL));

        // Fill the remaining length with random characters
        String allChars = UPPER + LOWER + DIGITS + LIMITED_SPECIAL;
        for (int i = password.length(); i < PASSWORD_LENGTH; i++) {
            password.append(getRandomChar(allChars));
        }

        // Shuffle the password to improve randomness
        return shuffleString(password.toString());
    }

    private static char getRandomChar(String source) {
        return source.charAt(RANDOM.nextInt(source.length()));
    }

    private static String shuffleString(String input) {
        char[] chars = input.toCharArray();
        for (int i = chars.length - 1; i > 0; i--) {
            int j = RANDOM.nextInt(i + 1);
            char temp = chars[i];
            chars[i] = chars[j];
            chars[j] = temp;
        }
        return new String(chars);
    }
}
