const LogLevel = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG",
};

export const LOG = (
  logObj: unknown,
  description: string = LogLevel.INFO,
  level: string = LogLevel.INFO
) => {
  const COLORS = {
    INFO: "#2E86AB",
    WARN: "#F39C12",
    ERROR: "#E74C3C",
    DEBUG: "#27AE60",
    BG: "#111111",
  };

  const color =
    level in COLORS ? COLORS[level as keyof typeof COLORS] : "#FFFFFF";

  console.log("%c────────────────────────────────────────", "color: gray;");
  console.log(
    `%c ${description} `,
    `color: ${color}; font-weight: bold; font-size: 13px; background: ${COLORS.BG}; padding: 2px 6px; border-radius: 4px;`,
    logObj
  );
  console.log("%c────────────────────────────────────────", "color: gray;");
};
