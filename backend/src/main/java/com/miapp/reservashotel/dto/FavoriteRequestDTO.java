package com.miapp.reservashotel.dto;

import jakarta.validation.constraints.NotNull;

public class FavoriteRequestDTO {

  @NotNull
  private Long userId;

  public Long getUserId() { return userId; }
  public void setUserId(Long userId) { this.userId = userId; }
}

