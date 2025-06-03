#!/bin/bash
set -euo pipefail
set -x

echo "🔧 PhaseScript: Starting in $(pwd)"
echo "CONFIGURATION: $CONFIGURATION"
echo "PLATFORM_NAME: $PLATFORM_NAME"
echo "TMPDIR: $TMPDIR"

DEST=${CONFIGURATION_BUILD_DIR:-/tmp}/$UNLOCALIZED_RESOURCES_FOLDER_PATH

if [[ ! "${SKIP_BUNDLING_METRO_IP:-}" && "$CONFIGURATION" == *Debug* && "$PLATFORM_NAME" != *simulator* ]]; then
  SAFE_IP_PATH="$TMPDIR/NotesAppFixed-ip.txt"
  IP=""
  for num in {0..8}; do
    test_ip=$(ipconfig getifaddr en${num} 2>/dev/null || true)
    if [[ -n "$test_ip" ]]; then
      IP="$test_ip"
      break
    fi
  done

  if [[ -z "$IP" ]]; then
    IP=$(ifconfig | grep 'inet ' | grep -v '127.' | grep -v '169.254.' | awk 'NR==1{print $2}' || true)
  fi

  if [[ -n "$IP" ]]; then
    echo "$IP" > "$SAFE_IP_PATH"
    echo "🌐 Saved IP to: $SAFE_IP_PATH"
  else
    echo "⚠️ No IP found, skipping write"
  fi
fi

exit 0
