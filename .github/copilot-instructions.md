# GitHub Copilot Instructions for Vue Frontend Development

## 🎯 프로젝트 개요

- **프레임워크**: Vue 3
- **언어**: JavaScript (ES6+)
- **스타일**: Tailwind CSS
- **상태 관리**: Vuex
- **라우팅**: Vue Router
- **백엔드 연동**: Spring Boot 기반 REST API

## 🧱 컴포넌트 구조 및 명명 규칙

- **파일 구조**: `PascalCase`를 사용하여 컴포넌트 파일을 명명합니다. 예: `LoginForm.vue`, `PromptInput.vue`
- **컴포넌트 구성 순서**:
  1. `<template>`
  2. `<script setup>`
  3. `<style scoped>`
- **컴포넌트 크기**: 하나의 컴포넌트는 하나의 책임에 집중하며, 너무 크지 않도록 유지합니다.

## 🎨 스타일 가이드

- **Tailwind CSS**: 가능한 한 Tailwind의 유틸리티 클래스를 사용하여 스타일링합니다.
- **클래스 순서**: Tailwind의 권장 순서를 따릅니다.
- **커스텀 CSS**: 필요할 경우 최소한으로 사용하며, 전역 스타일은 피합니다.

## 🔐 인증 및 보안

- **소셜 로그인**: Google 및 Naver 소셜 로그인을 지원합니다.
- **토큰 관리**: 로그인 후 백엔드에서 전달된 JWT 토큰을 `localStorage`에 저장하고, 이후 API 요청 시 `Authorization` 헤더에 포함합니다.
- **보안 주의사항**: 민감한 정보는 클라이언트에 저장하지 않으며, 항상 HTTPS를 사용합니다.

## 🔄 API 통신

- **HTTP 클라이언트**: Axios를 사용하여 API와 통신합니다.
- **에러 처리**: 모든 API 응답에 대해 에러 처리를 구현하며, 사용자에게 적절한 피드백을 제공합니다.
- **응답 처리**: 백엔드에서 전달된 데이터를 컴포넌트의 상태에 반영합니다.

## 🧪 테스트 및 검증

- **코드 검토**: Copilot이 제안한 코드는 항상 검토하고, 필요시 수정합니다.
- **테스트**: 주요 기능에 대해 단위 테스트를 작성하며, 테스트 커버리지를 유지합니다.
- **형식 검사**: ESLint 및 Prettier를 사용하여 코드 형식을 유지합니다.

## 🧠 Copilot 사용 팁

- **명확한 주석 작성**: 원하는 기능에 대해 명확하고 구체적인 주석을 작성하여 Copilot의 제안을 유도합니다.
- **작은 단위로 작업**: 큰 기능을 한 번에 구현하기보다는, 작은 단위로 나누어 작업하여 Copilot의 제안을 효과적으로 활용합니다.
- **예제 제공**: 원하는 출력이나 동작에 대한 예제를 제공하면 Copilot이 더 정확한 코드를 제안합니다.

## 📁 디렉토리 구조 예시
- src/
├── assets/
├── components/
│   ├── LoginForm.vue
│   └── PromptInput.vue
├── views/
│   ├── LoginView.vue
│   └── PromptView.vue
├── router/
│   └── index.js
├── store/
│   └── index.js
└── App.vue